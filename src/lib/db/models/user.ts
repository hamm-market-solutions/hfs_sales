import { IsEmail, IsStrongPassword, Length, validate } from "class-validator";
import { EntityManager } from "typeorm";
import { hashSync } from "bcrypt-ts";
import { Err, Ok } from "ts-results";

import { User } from "./entities/User";

import HfsError, { HfsResult } from "@/lib/HfsError";
import { AppDataSource } from "@/data-source";

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

    const manager = AppDataSource.manager;

    if (!(await validatePassword(manager, this))) {
      return Err(new HfsError(401, ["Invalid email or password"]));
    }

    return Ok(true);
  }
}

export async function getUserByEmail(
  manager: EntityManager,
  email: string
): Promise<User | null> {
  return manager.findOneBy(User, { email: email });
}

export async function validatePassword(
  manager: EntityManager,
  loginParams: LoginParams
): Promise<boolean> {
  const user = await getUserByEmail(manager, loginParams.email);

  if (!user) return false;

  return user.password === hashSync(loginParams.password, 10);
}
