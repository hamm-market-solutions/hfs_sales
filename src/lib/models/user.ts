"use server";

import { compareSync } from "bcrypt-ts";
import { Err, None, Ok, Option, Some } from "ts-results";
import { decodeJwt, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

import UserModelError from "../errors/UserModelError";
import JwtError, { ACCESS_TOKEN, REFRESH_TOKEN } from "../errors/JwtError";

import HfsError, { HfsResult } from "@/lib/errors/HfsError";
import {
  getRefreshTokenAndVerify,
  signJWT,
  getAccessTokenAndVerify,
  decodeJWT,
} from "@/lib/auth/jwt";
import { authConfig } from "@/config/auth";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from "@/config/auth";
import { optionToNotFound } from "@/utils/conversions";
import { user as userTable } from "@/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export const getOptUserById = async (
  id: number,
): Promise<Option<typeof userTable.$inferSelect>> => {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  if (user) {
    return Some(user[0]);
  } else {
    return None;
  }
};

export const getUserByEmail = async (
  email: string,
): Promise<HfsResult<typeof userTable.$inferSelect>> => {
  const user = await getOptUserByEmail(email);
  console.log("user", user);

  return optionToNotFound(user, "user not found");
};

export const getOptUserByEmail = async (
  email: string,
): Promise<Option<typeof userTable.$inferSelect>> => {
  console.log("getting user by email", email);
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);
  console.log("found user", user);


  if (user) {
    return Some(user[0]);
  } else {
    return None;
  }
};

export const updateRefreshToken = async (
  userId: number,
): Promise<HfsResult<[string, JWTPayload]>> => {
  const user = await getOptUserById(userId);

  if (user.none) {
    return Err(new HfsError(404, UserModelError.notFound("user")));
  }
  const refreshTokenExp = Date.now() / 1000 + REFRESH_TOKEN_LIFETIME;
  const refreshTokenRes = await signJWT(
    authConfig.refresh_token_secret,
    { sub: user.val.id.toString() },
    { exp: refreshTokenExp },
  );

  if (refreshTokenRes.err) {
    return refreshTokenRes;
  }
  try {
    // await prisma.update({
    //   where: { id: userId },
    //   data: { refresh_token: refreshTokenRes.val },
    // });
  } catch (error) {
    return Err(
      new HfsError(
        500,
        UserModelError.updateError("refresh token"),
        error as Error,
      ),
    );
  }
  const decoded = decodeJWT(refreshTokenRes.val).unwrap();

  return Ok([refreshTokenRes.val, decoded]);
};

export const getOrUpdateRefreshToken = async (
  userId: number,
): Promise<HfsResult<[string, JWTPayload]>> => {
  const verifyRes = await getRefreshTokenAndVerify();

  if (verifyRes.err) {
    // If the refresh token is expired, update the refresh token. If the refresh token is invalid, return the error.
    if (
      verifyRes.val.is(JwtError.expired()) ||
      verifyRes.val.is(JwtError.notFound(REFRESH_TOKEN))
    ) {
      return await updateRefreshToken(userId);
    }

    return verifyRes;
  }

  return Ok(verifyRes.val);
};

/**
 * Update the access token for a user. Also updates the refresh token if necessary.
 */
export const updateAccessToken = async (
  userId: number,
): Promise<
  HfsResult<{
    accessToken: [string, JWTPayload];
    refreshToken: [string, JWTPayload];
  }>
> => {
  const refreshTokenRes = await getOrUpdateRefreshToken(userId);

  if (refreshTokenRes.err) {
    return refreshTokenRes;
  }
  const accessTokenExp = Date.now() / 1000 + ACCESS_TOKEN_LIFETIME;
  const newAccessTokenRes = await signJWT(
    authConfig.access_token_secret,
    { sub: userId.toString() },
    { exp: accessTokenExp },
  );

  if (newAccessTokenRes.err) {
    return newAccessTokenRes;
  }

  const accessTokenPayload = decodeJWT(newAccessTokenRes.val).unwrap();

  return Ok({
    accessToken: [newAccessTokenRes.val, accessTokenPayload],
    refreshToken: refreshTokenRes.val,
  });
};

/**
 * Get or update the access token for a user.
 */
export const getOrUpdateAccessToken = async (): Promise<
  HfsResult<{
    accessToken: [string, JWTPayload];
    refreshToken: [string, JWTPayload];
  }>
> => {
  const accessTokenRes = await getAccessTokenAndVerify();

  if (accessTokenRes.err) {
    if (accessTokenRes.val.is(JwtError.expired(ACCESS_TOKEN))) {
      const accessToken = (await cookies()).get("accessToken")!;
      const decodeRes = decodeJwt(accessToken.value);

      return await updateAccessToken(parseInt(decodeRes.sub!));
    }
    if (accessTokenRes.val.is(JwtError.notFound(ACCESS_TOKEN))) {
      const refreshTokenRes = await getRefreshTokenAndVerify();

      if (refreshTokenRes.err) {
        return refreshTokenRes;
      }

      return await updateAccessToken(parseInt(refreshTokenRes.val[1].sub!));
    }

    return accessTokenRes;
  }
  const refreshTokenRes = await getOrUpdateRefreshToken(
    parseInt(accessTokenRes.val[1].sub!),
  );

  if (refreshTokenRes.err) {
    return refreshTokenRes;
  }

  return Ok({
    accessToken: accessTokenRes.val,
    refreshToken: refreshTokenRes.val,
  });
};

export async function isUserAuthenticated(): Promise<boolean> {
  try {
    (await getOrUpdateAccessToken()).unwrap();

    return true;
  } catch (_error) {
    return false;
  }
}

export async function verifyPassword(
  loginUserId: number,
  loginPassword: string,
): Promise<HfsResult<true>> {
  const userOpt = await getOptUserById(loginUserId);
  const doPasswordsMatch = userOpt.map((u) =>
    compareSync(loginPassword, u.password),
  );

  if (doPasswordsMatch.none || !doPasswordsMatch.val) {
    return Err(new HfsError(401, UserModelError.passwordMismatch()));
  }

  return Ok(true);
}
