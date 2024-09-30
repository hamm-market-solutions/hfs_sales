import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const isAuthorized = false;
    if (!isAuthorized) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/((?!login|register|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}