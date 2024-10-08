import { NextResponse } from "next/server";

import { HfsResult } from "../lib/HfsError";
import { HfsResponse } from "../types/responses";

export function resultToResponse<T extends object>(
  result: HfsResult<T>,
): NextResponse<HfsResponse> {
  if (result.ok) {
    return NextResponse.json({ status: 200, data: result.val });
  } else {
    return NextResponse.json({ ...result.val }, { status: result.val.status });
  }
}
