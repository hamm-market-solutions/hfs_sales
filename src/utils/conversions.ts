import { NextResponse } from "next/server";
import { SafeParseReturnType } from "zod";
import { Err, Ok, Option } from "ts-results";

import HfsError, { HfsResult } from "../lib/HfsError";
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

export function schemaToResult<Output extends any, Input = Output>(
  schema: SafeParseReturnType<Input, Output>,
): HfsResult<Output> {
  if (!schema.success) {
    return Err(
      new HfsError(
        400,
        schema.error?.flatten().fieldErrors ?? [
          "unknown error during schema validation",
        ],
      ),
    );
  }

  return Ok(schema.data!);
}

export function optionToNotFound<T>(
  option: Option<T>,
  message: string = "Resource not found",
): HfsResult<T> {
  if (option.none) {
    return Err(new HfsError(404, [message]));
  }

  return Ok(option.val);
}
