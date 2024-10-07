"use server";

import { LoginParams } from "@/lib/db/models/user";
import HfsError from "@/lib/HfsError";
import { LoginResponse } from "@/types/responses";
import { NextResponse } from "next/server";

export async function login(formData: FormData): Promise<LoginResponse> {
  // const loginEmail = formData.get("email") as string;
  // const loginPassword = formData.get("password") as string;
  // const loginUser = new LoginParams(loginEmail, loginPassword);

  // (await loginUser.validate()).unwrap();

  return { status: 400 };
}
