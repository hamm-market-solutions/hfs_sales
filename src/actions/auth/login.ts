"use server";

import { hashSync } from "bcrypt-ts";

import { LoginParams } from "@/lib/db/models/user";
import { LoginResponse } from "@/types/responses";

export async function login(formData: FormData): Promise<LoginResponse> {
  const loginEmail = formData.get("email") as string;
  const loginPassword = formData.get("password") as string;
  const loginUser = new LoginParams(loginEmail, loginPassword);

  (await loginUser.validate()).unwrap();

  return { status: 200 };
}
