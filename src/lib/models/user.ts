import { compareSync } from "bcrypt-ts";
import { Err, None, Ok, Option, Some } from "ts-results";
import { user } from "@prisma/client";

import HfsError, { HfsResult } from "@/lib/HfsError";
import prisma from "@/lib/prisma";
import { generateRandomToken } from "@/lib/auth/jwt";

export async function getRefreshToken(userId: number): Promise<Option<string>> {
  const user = await getUserById(userId);

  if (
    user.none ||
    user.val.refresh_token === null ||
    user.val.refresh_token_expiration === null ||
    user.val.refresh_token_expiration < new Date()
  ) {
    return None;
  }

  return Some(user.val.refresh_token);
}

export async function getUserById(id: number): Promise<Option<user>> {
  const user = await prisma.user.findFirst({ where: { id: id } });

  if (user) {
    return Some(user);
  } else {
    return None;
  }
}

export async function getUserByEmail(email: string): Promise<Option<user>> {
  const user = await prisma.user.findFirst({ where: { email: email } });

  if (user) {
    return Some(user);
  } else {
    return None;
  }
}

export async function updateRefreshToken(
  userId: number,
): Promise<HfsResult<user>> {
  const user = await getUserById(userId);

  if (user.none) {
    return Err(new HfsError(404, ["User not found"]));
  }
  const jwt = generateRandomToken(64);
  const jwtExpiration = new Date();

  // Expire after 1 day
  jwtExpiration.setDate(jwtExpiration.getDate() + 1);

  return Ok(
    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: jwt, refresh_token_expiration: jwtExpiration },
    }),
  );
}

export async function verifyPassword(
  loginUserId: number,
  loginPassword: string,
): Promise<HfsResult<boolean>> {
  const userOpt = await getUserById(loginUserId);
  const doPasswordsMatch = userOpt.map((u) =>
    compareSync(loginPassword, u.password),
  );

  if (doPasswordsMatch.none || !doPasswordsMatch.val) {
    return Err(new HfsError(401, ["Invalid email or password"]));
  }

  return Ok(true);
}
