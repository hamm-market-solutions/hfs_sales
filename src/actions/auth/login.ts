"use server";

import { cookies } from "next/headers";
import { Err } from "ts-results";
import { redirect } from "next/navigation";

import { LoginResponse } from "@/types/responses";
import { validateLoginForm } from "@/lib/schemas/login";
import {
  getUserByEmail,
  updateAccessToken,
  verifyPassword,
} from "@/lib/models/user";

export async function handleLogin(
  // _prevState: Err<LoginResponse> | undefined,
  form: FormData,
): Promise<Err<LoginResponse> | undefined> {
  console.log("handling login");

  const formValidationRes = validateLoginForm(form);

  if (formValidationRes.err) {
    return formValidationRes;
  }
  console.log("form validated");
  const email = formValidationRes.val.email;
  const password = formValidationRes.val.password;

  const userRes = await getUserByEmail(email);

  if (userRes.err) {
    return userRes;
  }
  console.log("user found");
  const passwordVerifyRes = await verifyPassword(userRes.val.id, password);

  if (passwordVerifyRes.err) {
    return passwordVerifyRes;
  }
  console.log("password verified");
  const accessTokenRes = await updateAccessToken(userRes.val.id);

  if (accessTokenRes.err) {
    return accessTokenRes;
  }
  console.log("access token updated");
  (await cookies()).set("refreshToken", accessTokenRes.val.refreshToken[0], {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: accessTokenRes.val.refreshToken[1].exp! * 1000,
  });
  console.log("refresh token set");

  redirect("/dashboard");
}
