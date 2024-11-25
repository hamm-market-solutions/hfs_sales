import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const headers = new Headers(request.headers);
    const pathname = request.nextUrl.pathname;

    console.log("pathname", pathname);


    headers.set("x-current-path", pathname);

    return NextResponse.next();
}
