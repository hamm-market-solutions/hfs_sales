"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateLoginForm } from "@/lib/schemas/login";
import {
  getUserByEmail,
  updateAccessToken,
  verifyPassword,
} from "@/lib/models/user";
import { HfsError } from "@/lib/errors/HfsError";
import { isErr, Some } from "@/utils/fp-ts";
import { Option } from "fp-ts/lib/Option";

export async function handleLogin(
  prevState: Option<HfsError>,
  formData: FormData,
): Promise<Option<HfsError>> {
  const formValidationRes = validateLoginForm(formData);

  if (isErr(formValidationRes)) {
    return Some(formValidationRes.right);
  }
  const email = formValidationRes.left.email;
  const password = formValidationRes.left.password;
  console.log("email", email);
  console.log("password", password);

  const userRes = await getUserByEmail(email);

  if (isErr(userRes)) {
    return Some(userRes.right);
  }
  const passwordVerifyRes = await verifyPassword(userRes.left.id, password);

  if (isErr(passwordVerifyRes)) {
    return Some(passwordVerifyRes.right);
  }
  const accessTokenRes = await updateAccessToken(userRes.left.id);

  if (isErr(accessTokenRes)) {
    return Some(accessTokenRes.right);
  }
  (await cookies()).set("refreshToken", accessTokenRes.left.refreshToken[0], {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: accessTokenRes.left.refreshToken[1].exp! * 1000,
  });

  redirect("/dashboard");
}
