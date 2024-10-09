import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { LoginRequest } from "@/types/auth";
import {
  getUserByEmail,
  updateRefreshToken,
  verifyPassword,
} from "@/lib/models/user";
import {
  optionToNotFound,
  resultToResponse,
  schemaToResult,
} from "@/utils/conversions";
import { HfsResponse } from "@/types/responses";
import { signJWT } from "@/lib/auth/jwt";
import { LoginFormSchema } from "@/lib/schemas";
import { authConfig } from "@/config/auth";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<HfsResponse>> {
  // Validate the login request
  const json: LoginRequest = await request.json();
  const loginEmail = json["email"];
  const loginPassword = json["password"];
  const validatedFields = schemaToResult(
    LoginFormSchema.safeParse({
      email: loginEmail,
      password: loginPassword,
    }),
  );

  if (validatedFields.err) {
    return resultToResponse(validatedFields);
  }
  // Get the user by email. If the user is not found, return a 404
  const user = optionToNotFound(
    await getUserByEmail(validatedFields.val.email),
  );

  if (user.err) {
    return resultToResponse(user);
  }
  // Verify the password. If the password is incorrect, return a 401
  const passwordVerifyRes = await verifyPassword(
    user.val.id,
    validatedFields.val.password,
  );

  if (passwordVerifyRes.err) {
    return resultToResponse(passwordVerifyRes);
  }
  // Update the JWT refresh token
  const updatedUser = await updateRefreshToken(user.val.id);

  if (updatedUser.err) {
    return resultToResponse(updatedUser);
  }
  // Store JWT token in cookie
  const accessToken = await signJWT(
    authConfig.jwt_secret,
    { sub: user.val.id.toString() },
    { exp: "5m" },
  );

  if (accessToken.err) {
    return resultToResponse(accessToken);
  }
  const oneHour = 60 * 60 * 1000;

  cookies().set("accessToken", accessToken.val, {
    httpOnly: true,
    expires: Date.now() + oneHour,
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
    status: 200,
    data: {
      token: accessToken,
    },
  });
}
