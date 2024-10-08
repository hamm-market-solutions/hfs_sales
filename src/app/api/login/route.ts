import { NextRequest, NextResponse } from "next/server";

import { LoginRequest } from "@/types/auth";
import {
  getUserByEmail,
  LoginParams,
  updateJwtToken,
} from "@/lib/db/models/user";
import { resultToResponse } from "@/utils/conversions";
import { HfsResponse } from "@/types/responses";
import { signJWT } from "@/lib/auth/jwt";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<HfsResponse>> {
  const json: LoginRequest = await request.json();

  const loginEmail = json["email"];
  const loginPassword = json["password"];
  const loginUser = new LoginParams(loginEmail, loginPassword);

  if ((await loginUser.validate()).err) {
    return resultToResponse(await loginUser.validate());
  }
  const user = (await getUserByEmail(loginEmail)).unwrap(); // Safe to unwrap because we validated the user above.
  const updatedUser = await updateJwtToken(user.id);

  if (updatedUser.err) {
    return resultToResponse(updatedUser);
  }

  return NextResponse.json({
    status: 200,
    data: {
      token: await signJWT(
        updatedUser.val.jwt!,
        { sub: user.id.toString() },
        { exp: "1h" },
      ),
    },
  });
}
