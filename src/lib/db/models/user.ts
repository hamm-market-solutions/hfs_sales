import { IsEmail, IsStrongPassword, Length, validate } from "class-validator";
import { compareSync, hashSync } from "bcrypt-ts";
import { Err, Ok } from "ts-results";

import HfsError, { HfsResult } from "@/lib/HfsError";
import prisma from "@/lib/db/prisma";

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

  public async validate(): Promise<HfsResult<true>> {
    const errors = await validate(this);

    if (errors.length > 0) {
      return Err(HfsError.fromValidationErrors(400, errors));
    }

    if (!(await matchPassword(this))) {
      return Err(new HfsError(401, ["Invalid email or password"]));
    }

    return Ok(true);
  }
}

export async function getUserByEmail(email: string) {
  return prisma.user.findFirst({ where: { email: email } });
}

export async function matchPassword(
  loginParams: LoginParams,
): Promise<boolean> {
  const user = await getUserByEmail(loginParams.email);

  if (!user) return false;

  return compareSync(loginParams.password, user.password);
}
