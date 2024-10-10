import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decodeJWT } from "@/lib/auth/jwt";
import { updateAccessToken } from "@/lib/models/user";
import { resultToResponse } from "@/utils/conversions";

export async function GET(request: NextRequest, response: NextResponse) {
  const accessToken = cookies().get("accessToken")!; // We checked if the access token is present in the middleware
  const decodeRes = decodeJWT(accessToken.value).unwrap(); // Safe to unwrap since we checked if the access token is malformed in the middleware
  /*
   * Verify that the access token is valid. If the access token is invalid,
   * simply update the cookie with the new access token
   */
  const userId = parseInt(decodeRes.sub!);
  const updateRes = await updateAccessToken(userId);

  if (updateRes.err) {
    return resultToResponse(updateRes);
  }
  response.cookies.set("accessToken", updateRes.val.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  response.cookies.set("refreshToken", updateRes.val.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  //   cookies().set("accessToken", updateRes.val.accessToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "strict",
  //   });
  //   console.log(cookies().get("accessToken"));

  //   cookies().set("refreshToken", updateRes.val.refreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "strict",
  //   });

  //   return NextResponse.json({
  //     accessToken: updateRes.val.accessToken,
  //     refreshToken: updateRes.val.refreshToken,
  //   });
}
