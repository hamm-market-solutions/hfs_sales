"use server";

import { cookies } from "next/headers";
import { Ok } from "ts-results";

import { LoginResponse } from "@/types/responses";
import { HfsResult } from "@/lib/errors/HfsError";
import { validateLoginForm } from "@/lib/schemas/login";
import {
  getUserByEmail,
  updateAccessToken,
  verifyPassword,
} from "@/lib/models/user";
import { NextResponse } from "next/server";
import { resultToResponse } from "@/utils/conversions";
import { redirect } from "next/dist/server/api-utils";

export async function handleLogin(
  form: FormData,
): Promise<NextResponse<LoginResponse>> {
  const formValidationRes = validateLoginForm(form);

  if (formValidationRes.err) {
    return resultToResponse(formValidationRes);
  }
  const email = formValidationRes.val.email;
  const password = formValidationRes.val.password;
  const userRes = await getUserByEmail(email);

  if (userRes.err) {
    return resultToResponse(userRes);
  }
  const passwordVerifyRes = await verifyPassword(userRes.val.id, password);

  if (passwordVerifyRes.err) {
    return resultToResponse(passwordVerifyRes);
  }
  const accessTokenRes = await updateAccessToken(userRes.val.id);

  if (accessTokenRes.err) {
    return resultToResponse(accessTokenRes);
  }
  cookies().set("refreshToken", accessTokenRes.val.refreshToken[0], {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: accessTokenRes.val.refreshToken[1].exp! * 1000,
  });

  return NextResponse.redirect("/dashboard");
}
