import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { decodeJWT, verifyJWT } from "./lib/auth/jwt";
import { authConfig } from "./config/auth";
import { resultToResponse } from "./utils/conversions";

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get("accessToken")?.value ?? "";
  const refreshToken = cookies().get("refreshToken")?.value ?? "";
  const decodeRes = decodeJWT(accessToken);

  if (decodeRes.err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const verifyRes = await verifyJWT<{ sub: string }>(
    authConfig.jwt_secret,
    accessToken,
  );

  if (verifyRes.err) {
    return resultToResponse(verifyRes);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (login page)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
