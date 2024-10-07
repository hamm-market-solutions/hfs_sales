import { SignJWT, jwtVerify } from "jose";

import { authConfig } from "@/config/auth";

export const signJWT = async (
  payload: { sub: string },
  options: { exp: string }
) => {
  try {
    const secret = new TextEncoder().encode(authConfig.jwt.secret_key);
    const alg = "HS256";

    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret);
  } catch (error) {
    throw error;
  }
};

export const verifyJWT = async <T>(token: string): Promise<T> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(authConfig.jwt.secret_key)
    );

    return payload as T;
  } catch (error) {
    throw new Error("Your token has expired.");
  }
};
