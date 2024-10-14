import { NextRequest, NextResponse } from "next/server";

import { LoginRequest } from "@/types/requests";
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
import {
  LoginErrResponse,
  LoginOkResponse,
  LoginResponse,
} from "@/types/responses";
import { LoginFormSchema } from "@/lib/schemas";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponse>> {
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
    return resultToResponse(validatedFields) as NextResponse<LoginErrResponse>;
  }
  // Get the user by email. If the user is not found, return a 404
  const user = optionToNotFound(
    await getUserByEmail(validatedFields.val.email),
  );

  if (user.err) {
    return resultToResponse(user) as NextResponse<LoginErrResponse>;
  }
  // Verify the password. If the password is incorrect, return a 401
  const passwordVerifyRes = await verifyPassword(
    user.val.id,
    validatedFields.val.password,
  );

  if (passwordVerifyRes.err) {
    return resultToResponse(
      passwordVerifyRes,
    ) as NextResponse<LoginErrResponse>;
  }
  const updateRes = await updateAccessToken(user.val.id);

  if (updateRes.err) {
    return resultToResponse(updateRes) as NextResponse<LoginErrResponse>;
  }

  return NextResponse.json({
    status: 200,
    data: {
      accessToken: updateRes.val.accessToken[0],
      refreshToken: updateRes.val.refreshToken[0],
    },
  }) as NextResponse<LoginOkResponse>;
}
