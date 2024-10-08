import { NextResponse } from "next/server";
import { Result } from "ts-results";

import HfsError from "./lib/HfsError";

export function toResponse<T>(result: Result<T, HfsError>): NextResponse {
  if (result.ok) {
    return NextResponse.json({ data: result.val });
  } else {
    return NextResponse.json({ ...result.val }, { status: result.val.status });
  }
}
