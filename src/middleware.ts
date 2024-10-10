import { NextRequest, NextResponse } from "next/server";

import { middleware as apiMiddleware } from "./app/api/middleware";
import { getOrUpdateAccessToken } from "./lib/models/user";
import { appConfig } from "./config/app";
import JwtError, { ACCESS_TOKEN } from "./lib/errors/JwtError";

export async function middleware(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
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
    // if (!accessTokenRes.val.is(JwtError.notFound(ACCESS_TOKEN))) {
      return NextResponse.redirect(appConfig.url + "/login");
    // }
    // const response = await fetch(appConfig.url + "/api/refresh", {
    //   method: "GET",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!response.ok) {
    //   console.log(response);
    //   return NextResponse.redirect(appConfig.url + "/login");
    // }
  }

  return NextResponse.next();
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
