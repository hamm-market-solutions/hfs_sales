import { SignJWT, jwtVerify } from "jose";
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

export const signJWT = async (
  secret: string,
  payload: { sub: string },
  options: { exp: string },
) => {
  try {
    const encoded = new TextEncoder().encode(secret);
    const alg = "HS256";

    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(encoded);
  } catch (error) {
    throw error;
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
    return Err(new HfsError(401, ["Token has been expired"]));
  }
};
