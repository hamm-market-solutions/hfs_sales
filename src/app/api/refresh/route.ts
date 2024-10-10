import { NextRequest, NextResponse } from "next/server";

import { updateAccessToken } from "@/lib/models/user";
import { getRefreshTokenAndVerify } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { HfsResponse } from "@/types/responses";
import { resultToResponse } from "@/utils/conversions";

export async function GET(request: NextRequest): Promise<NextResponse<HfsResponse>> {
  const refreshTokenRes = await getRefreshTokenAndVerify();

  if (refreshTokenRes.err) {
    return resultToResponse(refreshTokenRes);
  }

  const accessTokenRes = await updateAccessToken(parseInt(refreshTokenRes.val[1].sub!));

  if (accessTokenRes.err) {
    return resultToResponse(accessTokenRes);
  }
  // response.cookies.set("accessToken", accessTokenRes.val.accessToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "strict",
  // });
  // response.cookies.set("refreshToken", accessTokenRes.val.refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "strict",
  // });
    cookies().set("accessToken", accessTokenRes.val.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    console.log(cookies().get("accessToken"));

    cookies().set("refreshToken", accessTokenRes.val.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

  return resultToResponse(accessTokenRes);
}
