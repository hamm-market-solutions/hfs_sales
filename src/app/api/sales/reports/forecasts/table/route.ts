import { NextRequest, NextResponse } from "next/server";
import * as O from "fp-ts/Option";

import { getForecastTableDataMapper } from "@/lib/tables/forecast";
import { ForecastTableColumns, TableFilter, TableSort } from "@/types/table";
import { resultToResponse } from "@/utils/conversions";
import { Err, None, Ok } from "@/utils/fp-ts";
import { pipe } from "fp-ts/lib/function";

export const GET = async (
    request: NextRequest,
): Promise<NextResponse<ForecastTableColumns>> => {
    let sorting: O.Option<TableSort<ForecastTableColumns>>;
    let filters: O.Option<TableFilter<ForecastTableColumns>[]>;
    let page: number;
    let country: string;
    let brand: number;
    let seasonCode: number;
    try {
        const searchParams = request.nextUrl.searchParams;
        sorting = pipe(
            O.fromNullable(searchParams.get("sorting") != "" ? searchParams.get("sorting") : null),
            O.map((sort) => {
                return JSON.parse(sort) as TableSort<ForecastTableColumns>
            }),
        );
        filters = pipe(
            O.fromNullable(searchParams.get("filters") != "" ? searchParams.get("filters") : null),
            O.map((filter) => {
                return JSON.parse(filter) as TableFilter<ForecastTableColumns>[]
            }),
        );
        page = Number(searchParams.get("page") ?? 1);
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
                filters,
            }),
        ),
    );
};
