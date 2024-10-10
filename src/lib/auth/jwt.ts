import { JWTPayload, SignJWT, decodeJwt, jwtVerify } from "jose";
import { Err, None, Ok, Option, Some } from "ts-results";
import { cookies, headers } from "next/headers";

import HfsError, { HfsResult } from "../errors/HfsError";
import JwtError, { ACCESS_TOKEN, REFRESH_TOKEN } from "../errors/JwtError";

import { authConfig } from "@/config/auth";

export const decodeJWT = (token: string): HfsResult<JWTPayload> => {
  try {
    return Ok(decodeJwt(token));
  } catch (error) {
    return Err(
      new HfsError(401, { token: JwtError.decodingError() }, error as Error),
    );
  }
};

export const signJWT = async (
  secret: string,
  payload: { sub: string },
  options: { exp: string },
): Promise<HfsResult<string>> => {
  try {
    const encoded = new TextEncoder().encode(secret);
    const alg = "HS256";

    return Ok(
      await new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setExpirationTime(options.exp)
        .setIssuedAt()
        .setSubject(payload.sub)
        .sign(encoded),
    );
  } catch (error) {
    return Err(
      new HfsError(500, { token: JwtError.signingError() }, error as Error),
    );
  }
};

export const verifyJWT = async (
  secret: string,
  token: string,
): Promise<HfsResult<JWTPayload>> => {
  try {
    // First just decode the token to check if it's expired
    const decodedRes = decodeJWT(token);

    if (decodedRes.err) {
      return decodedRes;
    }
    if (decodedRes.val.exp! < Date.now() / 1000) {
      return Err(
        new HfsError(401, {
          token: JwtError.expired(),
        }),
      );
    }
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    return Ok(payload);
  } catch (error) {
    return Err(
      new HfsError(401, { token: JwtError.invalid() }, error as Error),
    );
  }
};

const getAccessTokenFromCookie = async (): Promise<Option<string>> => {
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    return Some(accessToken.value);
  }

  return None;
};

const getAccessTokenFromBearer = async (): Promise<Option<string>> => {
  const authorization = headers().get("authorization");

  if (authorization) {
    const [type, token] = authorization.split(" ");

    if (type === "Bearer") {
      return Some(token);
    }
  }

  return None;
};

/**
 * Get the access token from the cookie. If the access token is malformed or expired, return 401.
 */
export const getAccessTokenAndVerify = async (): Promise<
  HfsResult<[string, JWTPayload]>
> => {
  const accessToken = await getAccessTokenFromCookie();

  if (accessToken.none) {
    return Err(
      new HfsError(401, { accessToken: JwtError.notFound(ACCESS_TOKEN) }),
    );
  }

  const payloadRes = await verifyJWT(
    authConfig.access_token_secret,
    accessToken.val,
  );

  return payloadRes.map((payload) => [accessToken.val, payload]);
};

/** Get the refresh token from the cookie. If the refresh token is invalid, return None.
 */
const getRefreshTokenFromCookie = async (): Promise<Option<string>> => {
  const refreshToken = cookies().get("refreshToken");

  if (refreshToken) {
    return Some(refreshToken.value);
  }

  return None;
};

const getRefreshTokenFromBearer = async (): Promise<Option<string>> => {
  const authorization = headers().get("authorization");

  if (authorization) {
    const [type, token] = authorization.split(" ");

    if (type === "Bearer") {
      return Some(token);
    }
  }

  return None;
};

/**
 * Get the refresh token from the cookie. If the refresh token is malformed or expired, return 401.
 */
export const getRefreshTokenAndVerify = async (): Promise<
  HfsResult<[string, JWTPayload]>
> => {
  const refreshToken = await getRefreshTokenFromCookie();

  if (refreshToken.none) {
    return Err(
      new HfsError(401, { refreshToken: JwtError.notFound(REFRESH_TOKEN) }),
    );
  }

  const payloadRes = await verifyJWT(
    authConfig.refresh_token_secret,
    refreshToken.val,
  );

  return payloadRes.map((payload) => [refreshToken.val, payload]);
};
