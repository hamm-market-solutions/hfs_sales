import { NextResponse } from "next/server";
import { SafeParseReturnType } from "zod";
import { Err, Ok, Option } from "ts-results";
import { SortingState } from "@tanstack/react-table";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { asc, desc, SQL } from "drizzle-orm";
import { NextApiResponse } from "next";

import HfsError, { HfsResult } from "../lib/errors/HfsError";
import { HfsResponse } from "../types/responses";

import {
  ForecastTableData,
  ForecastTableRequest,
  TableResponse,
} from "@/types/table";

export function resultToResponse<T extends object, R = HfsResponse>(
  result: HfsResult<T>,
  response?: NextApiResponse<R>,
): NextResponse<R> {
  if (response) {
    response.status(result.ok ? 200 : result.val.status);
  }
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

export async function getForecastTableData({
  start,
  size,
  sorting,
  country,
  brand,
  season_code,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableData>> {
  const data = await getForecastTableData({
    start,
    size,
    sorting,
    country,
    brand,
    season_code,
  });

  return data;
}

export function schemaToResult<Output, Input = Output>(
  schema: SafeParseReturnType<Input, Output>,
): HfsResult<Output> {
  if (!schema.success) {
    return Err(
      new HfsError(400, schema.error?.errors[0].message || "invalid request"),
    );
  }

  return Ok(schema.data!);
}

export function optionToNotFound<T>(
  option: Option<T>,
  errorMessage = "resource not found",
): HfsResult<T> {
  if (option.none || option.val === null || option.val === undefined) {
    return Err(new HfsError(404, errorMessage));
  }

  return Ok(option.val);
}

export const sortingStateToDrizzle = (
  drizzleSelect: { [key: string]: MySqlColumn | SQL },
  sorting: SortingState,
) => {
  const sortings = [];

  for (const sort of sorting) {
    if (sort.desc) {
      sortings.push(desc(drizzleSelect[snakeCaseToCamelCase(sort.id)]));
    } else {
      sortings.push(asc(drizzleSelect[snakeCaseToCamelCase(sort.id)]));
    }
  }

  return sortings;
  // let flattenedSorting: { [key: string]: string } = {};

  // for (const sort of sorting) {
  //   flattenedSorting = {
  //     ...flattenedSorting,
  //     [sort.id]: sort.desc ? "desc" : "asc",
  //   };
  // }
  // for (const key in prismaSelect) {
  //   if (typeof prismaSelect[key] === "object") {
  //     prismaSelect[key] = sortingStateToDrizzle(
  //       prismaSelect[key]["select"],
  //       sorting,
  //     );
  //     if (Object.keys(prismaSelect[key]).length === 0) {
  //       delete prismaSelect[key];
  //     }
  //   } else {
  //     if (flattenedSorting[key]) {
  //       prismaSelect[key] = flattenedSorting[key];
  //     } else {
  //       delete prismaSelect[key];
  //     }
  //   }
  // }

  // return prismaSelect;
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

export const seasonToShort = (season: string) => {
  const [firstSeason, secondSeasonAndYear] = season?.split("/") ?? [];
  const [secondSeason, year] = secondSeasonAndYear.split(" ") ?? [];
  const firstLetterFirstSeason = firstSeason?.charAt(0).toUpperCase();
  const firstLetterSecondSeason = secondSeason?.charAt(0).toUpperCase();

  return `${firstLetterFirstSeason}/${firstLetterSecondSeason} ${year}`;
};
