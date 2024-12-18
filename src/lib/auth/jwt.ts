import { JWTPayload, SignJWT, decodeJwt, jwtVerify } from "jose";
import { Err, None, Ok, Option, Some } from "ts-results";
import { cookies, headers } from "next/headers";

import HfsError, { HfsResult } from "../errors/HfsError";
import JwtError, { ACCESS_TOKEN, REFRESH_TOKEN } from "../errors/JwtError";
import { getOrUpdateAccessToken } from "../models/user";

import { authConfig } from "@/config/auth";

export const decodeJWT = (token: string): HfsResult<JWTPayload> => {
    try {
        return Ok(decodeJwt(token));
    } catch (error) {
        return Err(new HfsError(401, JwtError.decodingError(), error as Error));
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
        return Err(new HfsError(500, JwtError.signingError(), error as Error));
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

        if (decodedRes.err) {
            return decodedRes;
        }
        if (decodedRes.val.exp! < Date.now() / 1000) {
            return Err(new HfsError(401, JwtError.expired()));
        }
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret),
        );

        return Ok(payload);
    } catch (error) {
        return Err(new HfsError(401, JwtError.invalid(), error as Error));
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

    if (fromCookie.some && fromCookie.val !== "null") {
        return Ok(fromCookie.val);
    }
    const fromBearer = await getAccessTokenFromBearer();

    if (fromBearer.some && fromBearer.val !== "null") {
        return Ok(fromBearer.val);
    }

    return Err(new HfsError(401, JwtError.notFound(ACCESS_TOKEN)));
};

/**
 * Gets the access token and decodes it. Verification is not done here.
 */
export const getAccessTokenPayload = async (): Promise<
  HfsResult<JWTPayload>
> => {
    const accessTokenRes = await getOrUpdateAccessToken();

    if (accessTokenRes.err) {
        return accessTokenRes;
    }

    return Ok(accessTokenRes.val.accessToken[1]);
};

/**
 * Get the access token from the cookie. If the access token is malformed or expired, return 401.
 */
export const getAccessTokenAndVerify = async (): Promise<
  HfsResult<[string, JWTPayload]>
> => {
    const accessToken = await getAccessToken();

    if (accessToken.err) {
        return accessToken;
    }
    const payloadRes = await verifyJWT(
        authConfig.access_token_secret,
        accessToken.val,
    );

    if (payloadRes.err) {
        if (payloadRes.val.is(JwtError.expired())) {
            return Err(
                new HfsError(401, JwtError.expired(ACCESS_TOKEN), payloadRes.val),
            );
        }
        if (payloadRes.val.is(JwtError.invalid())) {
            return Err(
                new HfsError(401, JwtError.invalid(ACCESS_TOKEN), payloadRes.val),
            );
        }

        return payloadRes;
    }

    return Ok([accessToken.val, payloadRes.val]);
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
    refreshToken?: string,
): Promise<HfsResult<[string, JWTPayload]>> => {
    let workingRefreshToken;

    if (!refreshToken) {
        const fromCookieOpt = await getRefreshTokenFromCookie();

        if (fromCookieOpt.none) {
            return Err(new HfsError(401, JwtError.notFound(REFRESH_TOKEN)));
        }
        workingRefreshToken = fromCookieOpt.val;
    } else {
        workingRefreshToken = refreshToken;
    }
    const payloadRes = await verifyJWT(
        authConfig.refresh_token_secret,
        workingRefreshToken,
    );

    if (payloadRes.err) {
        if (payloadRes.val.is(JwtError.expired())) {
            return Err(
                new HfsError(401, JwtError.expired(REFRESH_TOKEN), payloadRes.val),
            );
        }
        if (payloadRes.val.is(JwtError.invalid())) {
            return Err(
                new HfsError(401, JwtError.invalid(REFRESH_TOKEN), payloadRes.val),
            );
        }

        return payloadRes;
    }

    return Ok([workingRefreshToken, payloadRes.val]);
};
