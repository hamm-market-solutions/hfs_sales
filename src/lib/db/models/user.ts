import { IsEmail, IsStrongPassword, Length, validate } from "class-validator";
import { compareSync } from "bcrypt-ts";
import { Err, None, Ok, Option, Some } from "ts-results";
import { user } from "@prisma/client";

import HfsError, { HfsResult } from "@/lib/HfsError";
import prisma from "@/lib/db/prisma";
import { createVerificationToken } from "@/lib/auth/jwt";

export class LoginParams {
  @IsEmail()
  email: string;

  @Length(8, 70)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  public async validate(): Promise<HfsResult<{ isValid: true }>> {
    const errors = await validate(this);

    if (errors.length > 0) {
      return Err(HfsError.fromValidationErrors(400, errors));
    }

    if (!(await verifyPassword(this))) {
      return Err(new HfsError(401, ["Invalid email or password"]));
    }

    return Ok({ isValid: true });
  }
}

export async function getRefreshToken(userId: number): Promise<Option<string>> {
  const user = await getUserById(userId);

  if (
    user.none ||
    user.val.jwt === null ||
    user.val.jwt_expiration === null ||
    user.val.jwt_expiration < new Date()
  ) {
    return None;
  }

  return Some(user.val.jwt);
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

export async function updateJwtToken(userId: number): Promise<HfsResult<user>> {
  const user = await getUserById(userId);

  if (user.none) {
    return Err(new HfsError(404, ["User not found"]));
  }
  const jwt = createVerificationToken(user.unwrap().id);
  // Expire after 1 day
  const jwtExpiration = new Date();

  jwtExpiration.setDate(jwtExpiration.getDate() + 1);

  return Ok(
    await prisma.user.update({
      where: { id: userId },
      data: { jwt: jwt, jwt_expiration: jwtExpiration },
    }),
  );
}

export async function verifyPassword(
  loginParams: LoginParams,
): Promise<boolean> {
  const user = await getUserByEmail(loginParams.email);

  if (user.none) return false;
  const password = user.map((u) => u.password).unwrap(); // Safe to unwrap because we checked if the user exists above.

  return compareSync(loginParams.password, password);
}
