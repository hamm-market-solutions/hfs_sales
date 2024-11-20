"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateLoginForm } from "@/lib/schemas/login";
import {
  getUserByEmail,
  updateAccessToken,
  verifyPassword,
} from "@/lib/models/user";
import HfsError from "@/lib/errors/HfsError";

export async function handleLogin(
  // _prevState: HfsError | null,
  form: FormData,
): Promise<void> {
  console.log("handling login");
  console.log("validating form");
  const formValidationRes = validateLoginForm(form);

  if (formValidationRes.err) {
    console.log("form validation error", formValidationRes.val);
    return;

    // return formValidationRes.val;
  }
  const email = formValidationRes.val.email;
  const password = formValidationRes.val.password;
  console.log("form validation success", email, password);
  const userRes = await getUserByEmail(email);

  if (userRes.err) {
    return;
    // return userRes.val;
  }
  const passwordVerifyRes = await verifyPassword(userRes.val.id, password);

  if (passwordVerifyRes.err) {
    return;
    // return passwordVerifyRes.val;
  }
  const accessTokenRes = await updateAccessToken(userRes.val.id);

  if (accessTokenRes.err) {
    return;
    // return accessTokenRes.val;
  }
  (await cookies()).set("refreshToken", accessTokenRes.val.refreshToken[0], {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: accessTokenRes.val.refreshToken[1].exp! * 1000,
  });

  redirect("/dashboard");
}
