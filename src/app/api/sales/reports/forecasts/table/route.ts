import { NextRequest, NextResponse } from "next/server";
import { Ok } from "ts-results";

import { getForecastTableDataMapper } from "@/lib/tables/forecast";
import { ForecastTableColumns, TableSorting } from "@/types/table";
import { resultToResponse } from "@/utils/conversions";

export const GET = async (
    request: NextRequest,
): Promise<NextResponse<ForecastTableColumns>> => {
    const searchParams = request.nextUrl.searchParams;
    console.log(searchParams.get("sorting"));

    const sorting: TableSorting<ForecastTableColumns> = JSON.parse(searchParams.get("sorting")!);
    const search = searchParams.get("search")!;
    const country = searchParams.get("country")!;
    const brand = Number(searchParams.get("brand")!);
    const seasonCode = Number(searchParams.get("season_code")!);

    return resultToResponse(
        Ok(
            await getForecastTableDataMapper({
                sorting,
                country,
                brand,
                season_code: seasonCode,
                search,
            }),
        ),
    );
};
