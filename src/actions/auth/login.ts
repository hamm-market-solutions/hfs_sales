"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateLoginForm } from "@/lib/schemas/login";
import {
  getUserByEmail,
  updateAccessToken,
  verifyPassword,
} from "@/lib/models/user";

export async function handleLogin(
  // _prevState: Err<LoginResponse> | undefined,
  form: FormData,
): Promise<void> {
  console.log("handling login");

  const formValidationRes = validateLoginForm(form);

  if (formValidationRes.err) {
    return;
    // return formValidationRes;
  }
  console.log("form validated");
  const email = formValidationRes.val.email;
  const password = formValidationRes.val.password;

  const userRes = await getUserByEmail(email);

  console.log("userRes", userRes);

  if (userRes.err) {
    console.log("user not found", userRes.val);

    // return userRes;
    return;
  }
  console.log("user found");
  const passwordVerifyRes = await verifyPassword(userRes.val.id, password);

  if (passwordVerifyRes.err) {
    // return passwordVerifyRes;
    return;
  }
  console.log("password verified");
  const accessTokenRes = await updateAccessToken(userRes.val.id);

  if (accessTokenRes.err) {
    // return accessTokenRes;
    return;
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
