"use server";

import { redirect } from "next/navigation";
import { Ok } from "ts-results";

import { getOrUpdateAccessToken } from "@/lib/models/user";
import { HfsResult } from "@/lib/errors/HfsError";

export async function validateUser(): Promise<HfsResult<true>> {
  const accessTokenRes = await getOrUpdateAccessToken();

  if (accessTokenRes.err) {
    redirect("/login");
  }
  // (await cookies()).set("refreshToken", accessTokenRes.val.refreshToken[0], {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "strict",
  //     expires: accessTokenRes.val.refreshToken[1].exp! * 1000,
  // });

  return Ok(true);
}
