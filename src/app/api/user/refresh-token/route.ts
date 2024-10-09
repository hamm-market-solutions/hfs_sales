import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { user } from "@prisma/client";

import { optionToNotFound, resultToResponse } from "@/utils/conversions";
import { getUserById, updateRefreshToken } from "@/lib/models/user";
import { signJWT, verifyJWT } from "@/lib/auth/jwt";
import { authConfig } from "@/config/auth";

export async function GET() {
  const accessToken = cookies().get("token")?.value ?? "";
  const userId = decodeJwt(accessToken)?.sub;
  const user = await getUserById(Number(userId));

  if (user.none) {
    return resultToResponse(optionToNotFound<user>(user));
  }
  const verifyRes = await verifyJWT<{ sub: string }>(
    accessToken,
    user.val.refresh_token ?? "",
  );

  if (verifyRes.err) {
    return resultToResponse(verifyRes);
  }
  const updatedUser = await updateRefreshToken(user.val.id);

  if (updatedUser.err) {
    return resultToResponse(updatedUser);
  }
  const newAccessTokenRes = await signJWT(
    authConfig.jwt_secret,
    { sub: user.val.id.toString() },
    { exp: "1h" },
  );

  if (newAccessTokenRes.err) {
    return resultToResponse(newAccessTokenRes);
  }
  const fiveMinutes = 60 * 5 * 1000;

  cookies().set("accessToken", newAccessTokenRes.val, {
    httpOnly: true,
    expires: Date.now() + fiveMinutes,
    secure: true,
    sameSite: "strict",
  });
  cookies().set("refreshToken", updatedUser.val.refresh_token!, {
    httpOnly: true,
    expires: updatedUser.val.refresh_token_expiration!,
    secure: true,
    sameSite: "strict",
  });

  return NextResponse.json({
    refreshToken: updatedUser.val.refresh_token,
    accessToken: newAccessTokenRes.val,
  });
}
