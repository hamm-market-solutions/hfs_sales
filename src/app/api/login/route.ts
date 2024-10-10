import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { LoginRequest } from "@/types/auth";
import {
  getUserByEmail,
  updateAccessToken,
  verifyPassword,
} from "@/lib/models/user";
import {
  optionToNotFound,
  resultToResponse,
  schemaToResult,
} from "@/utils/conversions";
import { HfsResponse } from "@/types/responses";
import { LoginFormSchema } from "@/lib/schemas";

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

  const updateRes = await updateAccessToken(user.val.id);

  if (updateRes.err) {
    return resultToResponse(updateRes);
  }
  const fiveMinutesFromNow = Date.now() + 10 * 1000;
  const oneDayFromNow = Date.now() + 24 * 60 * 60 * 1000;

  cookies().set("accessToken", updateRes.val.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: fiveMinutesFromNow,
  });
  cookies().set("refreshToken", updateRes.val.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: oneDayFromNow,
  });

  return resultToResponse(updateRes);
}
