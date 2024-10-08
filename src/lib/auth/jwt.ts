import { SignJWT, jwtVerify } from "jose";

import { authConfig } from "@/config/auth";
import { randomUUID } from "crypto";
import { getUserById, updateJwtToken } from "../db/models/user";
import { Err, Result } from "ts-results";
import HfsError, { HfsResult } from "../HfsError";
import { user } from "@prisma/client";

export function createVerificationToken(
  userId: number,
): string {
  return randomUUID(); // Generates a unique verification token
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

export const verifyJWT = async <T>(token: string): Promise<T> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(authConfig.jwt.secret_key),
    );

    return payload as T;
  } catch (error) {
    throw new Error("Your token has expired.");
  }
};
