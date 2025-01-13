import { NextRequest, NextResponse } from "next/server";
import { Err, None, Ok, Option, Some } from "ts-results";

import { getForecastTableDataMapper } from "@/lib/tables/forecast";
import { ForecastTableColumns, TableSort } from "@/types/table";
import { resultToResponse } from "@/utils/conversions";

export const GET = async (
    request: NextRequest,
): Promise<NextResponse<ForecastTableColumns>> => {
    let sortingJson: Option<TableSort<ForecastTableColumns>> = None;
    let page: number;
    let search: string;
    let country: string;
    let brand: number;
    let seasonCode: number;
    try {
        const searchParams = request.nextUrl.searchParams;

        const sorting = searchParams.get("sorting");
        if (sorting) {
            sortingJson = Some(JSON.parse(sorting));
        }

        page = Number(searchParams.get("page") ?? 1);
        search = searchParams.get("search")!;
        country = searchParams.get("country")!;
        brand = Number(searchParams.get("brand")!);
        seasonCode = Number(searchParams.get("season_code")!);
    } catch (error) {
        return resultToResponse(Err({ status: 400, message: (error as Error).message, cause: None }));
    }

    return resultToResponse(
        Ok(
            await getForecastTableDataMapper({
                page,
                sorting: sortingJson,
                country,
                brand,
                season_code: seasonCode,
                search: Some(search),
            }),
        ),
    );
};
