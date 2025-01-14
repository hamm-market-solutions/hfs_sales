import { NextRequest, NextResponse } from "next/server";
import * as O from "fp-ts/Option";

import { getForecastTableDataMapper } from "@/lib/tables/forecast";
import { ForecastTableColumns, TableSort } from "@/types/table";
import { resultToResponse } from "@/utils/conversions";
import { Err, None, Ok, Some } from "@/utils/fp-ts";
import { pipe } from "fp-ts/lib/function";

export const GET = async (
    request: NextRequest,
): Promise<NextResponse<ForecastTableColumns>> => {
    let sorting: O.Option<TableSort<ForecastTableColumns>>;
    let page: number;
    let search: string;
    let country: string;
    let brand: number;
    let seasonCode: number;
    try {
        const searchParams = request.nextUrl.searchParams;
        sorting = pipe(
            O.fromNullable(searchParams.get("sorting") != "" ? searchParams.get("sorting") : null),
            O.map((sort) => {
                console.log("CEOWIOCE", sort, typeof sort);

                return JSON.parse(sort) as TableSort<ForecastTableColumns>
            }),
        );
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
                sorting,
                country,
                brand,
                season_code: seasonCode,
                search: Some(search),
            }),
        ),
    );
};
