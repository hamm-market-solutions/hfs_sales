import { NextRequest, NextResponse } from "next/server";

import { HfsResponse } from "@/types/responses";
import { resultToResponse } from "@/utils/conversions";
import { getAccessTokenAndVerify } from "@/lib/auth/jwt";
import { publicRoutes, routes } from "@/config/routes";

/**
 * Middleware to check if the user is authenticated. If the user is not
 * authenticated, return an error response. This middleware also functions
 * as a refresh token mechanism.
 */
export async function middleware(
  request: NextRequest,
): Promise<NextResponse<HfsResponse>> {
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next() as NextResponse<HfsResponse>;
  }
  /*
   * Check if the access token is present and decode it to get the user ID.
   * If the access token is not present or malformed, redirect to the login
   * page. This does not validate if the access token is still valid. This
   * is done in the next step.
   */
  const accessTokenRes = await getAccessTokenAndVerify();

  if (accessTokenRes.err) {
    return resultToResponse(accessTokenRes);
  }

  return NextResponse.next() as NextResponse<HfsResponse>;
}
