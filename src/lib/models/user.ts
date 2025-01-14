"use server";

import { compareSync } from "bcrypt-ts";
import { decodeJwt, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { map, Option } from "fp-ts/Option";

import UserModelError from "../errors/UserModelError";
import JwtError, { ACCESS_TOKEN, REFRESH_TOKEN } from "../errors/JwtError";

import { HfsResult } from "@/lib/errors/HfsError";
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
import { db } from "@/db";
import { Err, isErr, isNone, None, Ok, Some, unwrap } from "@/utils/fp-ts";
import { pipe } from "fp-ts/lib/function";

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

    return optionToNotFound(user, "user not found");
};

export const getOptUserByEmail = async (
    email: string,
): Promise<Option<typeof userTable.$inferSelect>> => {
    const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

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

    if (isNone(user)) {
        return Err({ status: 404, message: UserModelError.notFound("user"), cause: None });
    }
    const refreshTokenExp = Date.now() / 1000 + REFRESH_TOKEN_LIFETIME;
    const refreshTokenRes = await signJWT(
        authConfig.refresh_token_secret,
        { sub: user.value.id.toString() },
        { exp: refreshTokenExp },
    );

    if (isErr(refreshTokenRes)) {
        return refreshTokenRes;
    }
    try {
        // await prisma.update({
        //   where: { id: userId },
        //   data: { refresh_token: refreshTokenRes.val },
        // });
    } catch (error) {
        return Err({ status: 500, message: UserModelError.updateError("refresh token"), cause: Some(error as Error) });
    }
    const decoded = unwrap(decodeJWT(refreshTokenRes.left));

    return Ok([refreshTokenRes.left, decoded]);
};

export const getOrUpdateRefreshToken = async (
    userId: number,
): Promise<HfsResult<[string, JWTPayload]>> => {
    const verifyRes = await getRefreshTokenAndVerify();

    if (isErr(verifyRes)) {
        // If the refresh token is expired, update the refresh token. If the refresh token is invalid, return the error.
        if (
            verifyRes.right.message == JwtError.expired() ||
            verifyRes.right.message == JwtError.notFound(REFRESH_TOKEN)
        ) {
            return await updateRefreshToken(userId);
        }

        return verifyRes;
    }

    return Ok(verifyRes.left);
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

    if (isErr(refreshTokenRes)) {
        return refreshTokenRes;
    }
    const accessTokenExp = Date.now() / 1000 + ACCESS_TOKEN_LIFETIME;
    const newAccessTokenRes = await signJWT(
        authConfig.access_token_secret,
        { sub: userId.toString() },
        { exp: accessTokenExp },
    );

    if (isErr(newAccessTokenRes)) {
        return newAccessTokenRes;
    }

    const accessTokenPayload = unwrap(decodeJWT(newAccessTokenRes.left));

    return Ok({
        accessToken: [newAccessTokenRes.left, accessTokenPayload],
        refreshToken: refreshTokenRes.left,
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

    if (isErr(accessTokenRes)) {
        if (accessTokenRes.right.message == JwtError.expired(ACCESS_TOKEN)) {
            const accessToken = (await cookies()).get("accessToken")!;
            const decodeRes = decodeJwt(accessToken.value);

            return await updateAccessToken(parseInt(decodeRes.sub!));
        }
        if (accessTokenRes.right.message == JwtError.notFound(ACCESS_TOKEN)) {
            const refreshTokenRes = await getRefreshTokenAndVerify();

            if (isErr(refreshTokenRes)) {
                return refreshTokenRes;
            }

            return await updateAccessToken(parseInt(refreshTokenRes.left[1].sub!));
        }

        return accessTokenRes;
    }
    const refreshTokenRes = await getOrUpdateRefreshToken(
        parseInt(accessTokenRes.left[1].sub!),
    );

    if (isErr(refreshTokenRes)) {
        return refreshTokenRes;
    }

    return Ok({
        accessToken: accessTokenRes.left,
        refreshToken: refreshTokenRes.left,
    });
};

export async function verifyPassword(
    loginUserId: number,
    loginPassword: string,
): Promise<HfsResult<true>> {
    const userOpt = await getOptUserById(loginUserId);
    // const doPasswordsMatch = userOpt.map((u) =>
    //     compareSync(loginPassword, u.password),
    // );
    const doPasswordsMatch = pipe(
        userOpt,
        map((u) => compareSync(loginPassword, u.password)),
    )

    if (isNone(doPasswordsMatch) || !doPasswordsMatch.value) {
        return Err({ status: 401, message: UserModelError.passwordMismatch(), cause: None });
    }

    return Ok(true);
}

export async function getCurrentUser(): Promise<
  HfsResult<typeof userTable.$inferSelect>
  > {
    const accessTokenRes = await getOrUpdateAccessToken();

    if (isErr(accessTokenRes)) {
        return accessTokenRes;
    }
    const user = await getOptUserById(
        parseInt(accessTokenRes.left.accessToken[1].sub!),
    );

    return optionToNotFound(user, "user not found");
}
