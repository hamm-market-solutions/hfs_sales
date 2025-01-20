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
import { LoginFormSchema } from "@/lib/schemas/login";
import { isErr } from "@/utils/fp-ts";

export async function POST(
  request: NextRequest,
  // response: NextApiResponse<LoginResponse>,
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

  if (isErr(validatedFields)) {
    return resultToResponse(validatedFields);
  }
  // Get the user by email. If the user is not found, return a 404
  const user = optionToNotFound(
    await getOptUserByEmail(validatedFields.left.email),
  );

  if (isErr(user)) {
    return resultToResponse(user);
  }
  // Verify the password. If the password is incorrect, return a 401
  const passwordVerifyRes = await verifyPassword(user.left.id, loginPassword);

  if (isErr(passwordVerifyRes)) {
    return resultToResponse(passwordVerifyRes);
  }
  const updateRes = await updateAccessToken(user.left.id);

  if (isErr(updateRes)) {
    return resultToResponse(updateRes);
  }

  return NextResponse.json({
    status: 200,
    data: {
      accessToken: updateRes.left.accessToken[0],
      refreshToken: updateRes.left.refreshToken[0],
    },
  });
}
