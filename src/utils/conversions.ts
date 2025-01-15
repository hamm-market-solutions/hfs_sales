import { NextResponse } from "next/server";
import { SafeParseReturnType } from "zod";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { asc, desc, like, SQL } from "drizzle-orm";
import { NextApiResponse } from "next";
import { Option } from "fp-ts/Option";

import { HfsResult } from "../lib/errors/HfsError";
import { HfsResponse } from "../types/responses";
import { TableFilter, TableSort } from "@/src/types/table";
import { Err, isNone, isOk, isSome, None, Ok, Some } from "./fp-ts";

export function resultToResponse<T extends object, R = HfsResponse<T>>(
  result: HfsResult<T>,
  response: Option<NextApiResponse<R>> = None,
): NextResponse<R> {
  if (isSome(response)) {
    response.value.status(isOk(result) ? 200 : result.right.status);
  }
  if (isOk(result)) {
    return NextResponse.json({
      status: 200,
      data: result.left,
    }) as NextResponse<R>;
  } else {
    return NextResponse.json(
      { ...result.right },
      { status: result.right.status },
    ) as NextResponse<R>;
  }
}

export function schemaToResult<Output, Input = Output>(
  schema: SafeParseReturnType<Input, Output>,
): HfsResult<Output> {
  if (!schema.success) {
    return Err({
      status: 400,
      message: schema.error?.errors[0].message,
      cause: None,
    });
  }

  return Ok(schema.data!);
}

export function optionToNotFound<T>(
  option: Option<T>,
  errorMessage = "resource not found",
): HfsResult<T> {
  if (isNone(option) || option.value === null || option.value === undefined) {
    return Err({ status: 404, message: errorMessage, cause: None });
  }

  return Ok(option.value);
}

export const tableSortingToDrizzle = <T extends object>(
  drizzleSelect: { [key: string]: MySqlColumn | SQL },
  sort: Option<TableSort<T>>,
): SQL<unknown>[] => {
  const sortings: SQL<unknown>[] = [];
  if (isNone(sort) || sort.value.column === "") {
    return sortings;
  }
  if (sort.value.direction == "descending") {
    sortings.push(
      desc(drizzleSelect[snakeCaseToCamelCase(sort.value.column as string)]),
    );
  } else {
    sortings.push(
      asc(drizzleSelect[snakeCaseToCamelCase(sort.value.column as string)]),
    );
  }

  return sortings;
};

export const tableFiltersToDrizzle = <T extends object>(
  drizzleSelect: { [key: string]: MySqlColumn | SQL },
  filters: Option<TableFilter<T>[]>,
): SQL<unknown>[] => {
  const filterings: SQL<unknown>[] = [];
  if (isNone(filters)) {
    return filterings;
  }

  filters.value.forEach((filter) => {
    const columnName = snakeCaseToCamelCase(filter.column as string);
    const column = drizzleSelect[columnName];
    filterings.push(like(column, `%${filter.value}%`));
  });

  return filterings;
};

export const phaseToDrop = ({
  pre_collection,
  main_collection,
  late_collection,
  Special_collection,
}: {
  pre_collection: number;
  main_collection: number;
  late_collection: number;
  Special_collection: number;
}) => {
  if (pre_collection !== 0) {
    return 1;
  } else if (main_collection !== 0) {
    return 2;
  } else if (late_collection !== 0) {
    return 3;
  } else if (Special_collection !== 0) {
    return 4;
  }

  return 0;
};

export const snakeCaseToCamelCase = (str: string) => {
  return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
};

export const camelCaseToSnakeCase = (str: string) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Converts any case string to camel case, including:
 * - snake_case
 * - kebab-case
 * - PascalCase
 * - camelCase
 * - Title Case
 */
export const toCamelCase = (input: string) => {
  // Normalize input to lowercase and split by non-alphanumeric characters or boundaries.
  const words = input
    .trim()
    .replace(/[-_\s]+/g, " ") // Replace separators (hyphen, underscore, space) with a single space.
    .split(/\s+/); // Split by spaces (words are separated by spaces).

  // Convert the first word to lowercase and subsequent words to title case.
  return words
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export const seasonToShort = (season: string): Option<string> => {
  if (!season) {
    return None;
  }

  const [firstSeason, secondSeasonAndYear] = season?.split("/") ?? [];
  const [secondSeason, year] = secondSeasonAndYear.split(" ") ?? [];
  const firstLetterFirstSeason = firstSeason?.charAt(0).toUpperCase();
  const firstLetterSecondSeason = secondSeason?.charAt(0).toUpperCase();

  return Some(`${firstLetterFirstSeason}/${firstLetterSecondSeason} ${year}`);
};
