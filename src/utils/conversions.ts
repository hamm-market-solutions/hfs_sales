import { NextResponse } from "next/server";
import { object, SafeParseReturnType } from "zod";
import { Err, Ok, Option } from "ts-results";

import HfsError, { HfsResult } from "../lib/errors/HfsError";
import { HfsResponse } from "../types/responses";
import { SortingState } from "@tanstack/react-table";

export function resultToResponse<T extends object, R = HfsResponse>(
  result: HfsResult<T>,
): NextResponse<R> {
  if (result.ok) {
    return NextResponse.json({
      status: 200,
      data: result.val,
    }) as NextResponse<R>;
  } else {
    return NextResponse.json(
      { ...result.val },
      { status: result.val.status },
    ) as NextResponse<R>;
  }
}

export function schemaToResult<Output extends any, Input = Output>(
  schema: SafeParseReturnType<Input, Output>,
): HfsResult<Output> {
  if (!schema.success) {
    return Err(
      new HfsError(
        400,
        // @ts-ignore
        (schema.error?.flatten().fieldErrors as {
          [type: string]: string;
        }) ?? {
          formField: "unknown error during schema validation",
        },
      ),
    );
  }

  return Ok(schema.data!);
}

export function optionToNotFound<T>(
  option: Option<T>,
  errorMessage = { resource: "Resource not found" },
): HfsResult<T> {
  if (option.none) {
    return Err(new HfsError(404, errorMessage));
  }

  return Ok(option.val);
}

export const sortingToPrisma = (prismaSelect: { [key: string]: any }, sorting: SortingState) => {
  let flattenedSorting: {[key: string]: string} = {};
  for (const sort of sorting) {
    flattenedSorting = { ...flattenedSorting, [sort.id]: sort.desc ? "desc" : "asc" };
  }
  for (const key in prismaSelect) {
    if (typeof prismaSelect[key] === "object") {
      prismaSelect[key] = sortingToPrisma(prismaSelect[key]["select"], sorting);
      if (Object.keys(prismaSelect[key]).length === 0) {
        delete prismaSelect[key];
      }
    } else {
      if (flattenedSorting[key]) {
        prismaSelect[key] = flattenedSorting[key];
      } else {
        delete prismaSelect[key];
      }
    }
  }

  return prismaSelect;
};
