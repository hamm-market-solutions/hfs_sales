import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { optionToNotFound } from "@/utils/conversions";
import { getUserById } from "@/lib/models/user";

export async function GET() {
  const accessToken = cookies().get("token")?.value ?? "";
  const userId = decodeJwt(accessToken)?.sub;
  const user = await getUserById(Number(userId));

  if (user.none) {
    return optionToNotFound(user);
  }

  return NextResponse.json({ refreshToken: user.val.refresh_token });
}