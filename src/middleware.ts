import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

import { verifyJWT } from "./lib/auth/jwt";
import { resultToResponse } from "./utils/conversions";

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get("accessToken")?.value ?? "";
  const refreshToken = cookies().get("refreshToken")?.value ?? "";
  const userId = decodeJwt(accessToken)?.sub;

  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const verifyRes = await verifyJWT<{ sub: string }>(refreshToken, accessToken);

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
