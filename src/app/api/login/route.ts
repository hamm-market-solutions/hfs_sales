import HfsError from "@/lib/HfsError";
import { LoginRequest } from "@/types/auth";
import { errors } from "jose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Err } from "ts-results";
import { LoginParams } from "@/lib/db/models/user";
import { toResponse } from "@/result.extensions";

export async function POST(request: NextRequest) {
  const json: LoginRequest = await request.json();
  const error = Err(new HfsError(400, { message: "bad request" }));

  const loginEmail = json["email"];
  const loginPassword = json["password"];
  const loginUser = new LoginParams(loginEmail, loginPassword);

  return toResponse(await loginUser.validate());
}
