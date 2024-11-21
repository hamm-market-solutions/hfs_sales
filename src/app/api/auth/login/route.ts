import { NextRequest, NextResponse } from "next/server";

import { LoginRequest } from "@/types/requests";
import {
  getOptUserByEmail,
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
import { LoginFormSchema } from "@/lib/schemas/login";
import { NextApiResponse } from "next";

export async function POST(
  request: NextRequest,
  response: NextApiResponse<LoginResponse>,
) {
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
    await getOptUserByEmail(validatedFields.val.email),
  );

  if (user.err) {
    return resultToResponse(user);
  }
  // Verify the password. If the password is incorrect, return a 401
  const passwordVerifyRes = await verifyPassword(user.val.id, loginPassword);

  if (passwordVerifyRes.err) {
    return resultToResponse(
      passwordVerifyRes,
    );
  }
  const updateRes = await updateAccessToken(user.val.id);

  if (updateRes.err) {
    return resultToResponse(updateRes);
  }

  return NextResponse.json({
    status: 200,
    data: {
      accessToken: updateRes.val.accessToken[0],
      refreshToken: updateRes.val.refreshToken[0],
    },
  }, );
}
