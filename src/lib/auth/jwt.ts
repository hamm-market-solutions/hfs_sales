import { JWTPayload, SignJWT, decodeJwt, jwtVerify } from "jose";
import { Err, Ok } from "ts-results";

import HfsError, { HfsResult } from "../HfsError";

export function generateRandomToken(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);

    token += characters[randomIndex];
  }

  return token;
}

export const decodeJWT = (token: string): HfsResult<JWTPayload> => {
  try {
    return Ok(decodeJwt(token));
  } catch (error) {
    return Err(
      new HfsError(
        401,
        { accessToken: "Failed to decode JWT" },
        error as Error,
      ),
    );
  }
};

// TODO: Implement HfsResult type
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
      HfsError.fromErrors(500, ["Unable to sign new JWT"], error as Error),
    );
  }
};

export const verifyJWT = async <T>(
  secret: string,
  token: string,
): Promise<HfsResult<T>> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    return Ok(payload as T);
  } catch (error) {
    return Err(
      new HfsError(
        401,
        { accessToken: "Access token is expired" },
        error as Error,
      ),
    );
  }
};
