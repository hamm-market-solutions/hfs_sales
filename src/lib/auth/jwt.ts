import { decodeJwt, JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { Option } from "fp-ts/Option";

import { HfsError, HfsResult } from "../errors/HfsError";
import JwtError, { ACCESS_TOKEN, REFRESH_TOKEN } from "../errors/JwtError";
import { getOrUpdateAccessToken } from "../models/user";

import { authConfig } from "@/src/config/auth";
import { Err, isErr, isNone, isSome, None, Ok, Some } from "@/src/utils/fp-ts";

export const decodeJWT = (token: string): HfsResult<JWTPayload> => {
  try {
    return Ok(decodeJwt(token));
  } catch (error) {
    const err: HfsError = {
      status: 401,
      message: JwtError.decodingError(),
      cause: Some(error as Error),
    };
    return Err(err);
  }
};

export const signJWT = async (
  secret: string,
  payload: { sub: string },
  options: { exp: number },
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
    const err: HfsError = {
      status: 500,
      message: JwtError.signingError(),
      cause: Some(error as Error),
    };
    return Err(err);
  }
};

export const verifyJWT = async (
  secret: string,
  token: string,
): Promise<HfsResult<JWTPayload>> => {
  try {
    // First just decode the token to check if it's expired to return
    // a reliable error message if we would like to math the error
    const decodedRes = decodeJWT(token);

    if (isErr(decodedRes)) {
      return decodedRes;
    }
    if (decodedRes.left.exp! < Date.now() / 1000) {
      const err: HfsError = {
        status: 401,
        message: JwtError.expired(),
        cause: None,
      };
      return Err(err);
    }
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    return Ok(payload);
  } catch (error) {
    const err: HfsError = {
      status: 401,
      message: JwtError.invalid(),
      cause: Some(error as Error),
    };
    return Err(err);
  }
};

const getAccessTokenFromCookie = async (): Promise<Option<string>> => {
  const accessToken = (await cookies()).get("accessToken");

  if (accessToken && accessToken.value !== "") {
    return Some(accessToken.value);
  }

  return None;
};

const getAccessTokenFromBearer = async (): Promise<Option<string>> => {
  const authorization = (await headers()).get("authorization");

  if (authorization) {
    const [type, token] = authorization.split(" ");

    if (type === "Bearer") {
      return Some(token);
    }
  }

  return None;
};

export const getAccessToken = async (): Promise<HfsResult<string>> => {
  const fromCookie = await getAccessTokenFromCookie();

  if (isSome(fromCookie) && fromCookie.value !== "null") {
    return Ok(fromCookie.value);
  }
  const fromBearer = await getAccessTokenFromBearer();

  if (isSome(fromBearer) && fromBearer.value !== "null") {
    return Ok(fromBearer.value);
  }
  const err: HfsError = {
    status: 401,
    message: JwtError.notFound(ACCESS_TOKEN),
    cause: None,
  };

  return Err(err);
};

/**
 * Gets the access token and decodes it. Verification is not done here.
 */
export const getAccessTokenPayload = async (): Promise<
  HfsResult<JWTPayload>
> => {
  const accessTokenRes = await getOrUpdateAccessToken();

  if (isErr(accessTokenRes)) {
    return accessTokenRes;
  }

  return Ok(accessTokenRes.left.accessToken[1]);
};

/**
 * Get the access token from the cookie. If the access token is malformed or expired, return 401.
 */
export const getAccessTokenAndVerify = async (): Promise<
  HfsResult<[string, JWTPayload]>
> => {
  const accessToken = await getAccessToken();

  if (isErr(accessToken)) {
    return accessToken;
  }
  const payloadRes = await verifyJWT(
    authConfig.access_token_secret,
    accessToken.left,
  );

  if (isErr(payloadRes)) {
    if (payloadRes.right.message == JwtError.expired()) {
      const err: HfsError = {
        status: 401,
        message: JwtError.expired(ACCESS_TOKEN),
        cause: None,
      };

      return Err(
        err,
      );
    }
    if (payloadRes.right.message == JwtError.invalid()) {
      const err: HfsError = {
        status: 401,
        message: JwtError.invalid(ACCESS_TOKEN),
        cause: None,
      };
      return Err(
        err,
      );
    }

    return payloadRes;
  }

  return Ok([accessToken.left, payloadRes.left]);
};

/** Get the refresh token from the cookie. If the refresh token is invalid, return None.
 */
const getRefreshTokenFromCookie = async (): Promise<Option<string>> => {
  const refreshToken = (await cookies()).get("refreshToken");

  if (refreshToken && refreshToken.value !== "") {
    return Some(refreshToken.value);
  }

  return None;
};

/**
 * Get the refresh token from the cookie. If the refresh token is malformed or expired, return 401.
 */
export const getRefreshTokenAndVerify = async (
  refreshToken: Option<string> = None,
): Promise<HfsResult<[string, JWTPayload]>> => {
  let workingRefreshToken: string;

  if (isNone(refreshToken)) {
    const fromCookieOpt = await getRefreshTokenFromCookie();

    if (isNone(fromCookieOpt)) {
      const err: HfsError = {
        status: 401,
        message: JwtError.notFound(REFRESH_TOKEN),
        cause: None,
      };
      return Err(err);
    }
    workingRefreshToken = fromCookieOpt.value;
  } else {
    workingRefreshToken = refreshToken.value;
  }
  const payloadRes = await verifyJWT(
    authConfig.refresh_token_secret,
    workingRefreshToken,
  );

  if (isErr(payloadRes)) {
    if (payloadRes.right.message == JwtError.expired()) {
      const err: HfsError = {
        status: 401,
        message: JwtError.expired(REFRESH_TOKEN),
        cause: None,
      };
      return Err(
        err,
      );
    }
    if (payloadRes.right.message == JwtError.invalid()) {
      const err: HfsError = {
        status: 401,
        message: JwtError.invalid(REFRESH_TOKEN),
        cause: None,
      };
      return Err(
        err,
      );
    }

    return payloadRes;
  }

  return Ok([workingRefreshToken, payloadRes.left]);
};
