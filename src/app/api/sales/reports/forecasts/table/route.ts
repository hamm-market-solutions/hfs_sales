import { SortingState } from "@tanstack/react-table";
import { NextRequest, NextResponse } from "next/server";
import { Ok } from "ts-results";

import { getForecastTableDataMapper } from "@/lib/tables/forecast";
import { ForecastTableData } from "@/types/table";
import { resultToResponse } from "@/utils/conversions";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<ForecastTableData>> => {
  const searchParams = request.nextUrl.searchParams;
  const start = Number(searchParams.get("start"));
  const size = Number(searchParams.get("size"));
  console.log(searchParams.get("sorting"));

  const sorting: SortingState = JSON.parse(searchParams.get("sorting")!);
  const search = searchParams.get("search")!;
  const country = searchParams.get("country")!;
  const brand = Number(searchParams.get("brand")!);
  const seasonCode = Number(searchParams.get("season_code")!);

  return resultToResponse(
    Ok(
      await getForecastTableDataMapper({
        start,
        size,
        sorting,
        country,
        brand,
        season_code: seasonCode,
        search,
      }),
    ),
  );
};
