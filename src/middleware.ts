import { NextRequest, NextResponse } from "next/server";
import { Err } from "ts-results";

import { middleware as apiMiddleware } from "./app/api/middleware";
import { appConfig } from "./config/app";
import { getOrUpdateAccessToken } from "./lib/models/user";
import { resultToResponse } from "./utils/conversions";
import HfsError from "./lib/errors/HfsError";
import ErrorVariant from "./lib/errors/ErrorVariant";

export async function middleware(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return apiMiddleware(request);
    }
    /*
     * Check if the access token is present and decode it to get the user ID.
     * If the access token is not present or malformed, redirect to the login page.
     * This does not validate if the access token is still valid. This is done in
     * the next step.
     */
    const accessTokenRes = await getOrUpdateAccessToken();

    if (accessTokenRes.err) {
      return NextResponse.redirect(appConfig.url + "/login");
    }
    const nextResponse = NextResponse.next();

    nextResponse.cookies.set("accessToken", accessTokenRes.val.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    nextResponse.cookies.set("refreshToken", accessTokenRes.val.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return nextResponse;
  } catch (error) {
    return resultToResponse(
      Err(
        new HfsError(
          500,
          { unexpected: ErrorVariant.unexpected() },
          error as Error,
        ),
      ),
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!login|assets|_next/static|_next/image|favicon.ico).*)",
  ],
};
