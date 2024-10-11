import { NextRequest, NextResponse } from "next/server";

import { middleware as apiMiddleware } from "./app/api/middleware";
import { appConfig } from "./config/app";
import { getOrUpdateAccessToken } from "./lib/models/user";

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
    // const cookieString = request.headers.get("cookie");
    // const response = await fetch(appConfig.url + "/api/refresh", {
    //   method: "GET",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Cookie: cookieString!,
    //   },
    // });

    // if (!response.ok) {
    //   return NextResponse.redirect(appConfig.url + "/login");
    // }
    // const refreshResponse: HfsOkResponse<{
    //   accessToken: string;
    //   refreshToken: string;
    // }> = await response.json();
    // const nextResponse = NextResponse.next();

    // nextResponse.cookies.set("accessToken", refreshResponse.data.accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    // });
    // nextResponse.cookies.set(
    //   "refreshToken",
    //   refreshResponse.data.refreshToken,
    //   {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //   },
    // );

    // return nextResponse;
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
