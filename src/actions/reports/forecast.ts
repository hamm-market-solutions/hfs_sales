"use server";

import { getUserCountries} from "@/lib/models/userHasCountry";
import { GetUserCountriesOkResponse } from "@/types/responses";
import { HfsResult } from "@/lib/errors/HfsError";
import { getOrUpdateAccessToken } from "@/lib/models/user";
// import { ForecastTableColumns, TableResponse, TableSorting } from "@/types/table";
// import { getForecastTableDataMapper } from "@/lib/tables/forecast";
import { Err, isErr, Ok, Some } from "@/utils/fp-ts";
import { fromNullable } from "fp-ts/lib/Option";
import { ForecastTableColumns, TableFilter, TableResponse, TableSort } from "@/types/table";
import { getForecastTableDataMapper } from "@/lib/tables/forecast";

export async function getUserCountriesAction(): Promise<HfsResult<GetUserCountriesOkResponse>> {
    const payloadRes = await getOrUpdateAccessToken();

    if (isErr(payloadRes)) {
        return payloadRes;
    }
    const userId = Number(payloadRes.left.accessToken[1].sub!);
    const userCountriesRes = await getUserCountries(userId);

    if (isErr(userCountriesRes)) {
        return Err(userCountriesRes.right);
    }

    return Ok({
        status: 200,
        data: {
            // countries: pipe(
            //     userCountriesRes.left.map,
            //     map((userCountry) => ({
            //         code: userCountry.user_has_country.countryCode,
            //         name: userCountry.s_country?.name,
            //     })),
            // ),
            countries: userCountriesRes.left.map((userCountry) => ({
                code: userCountry.user_has_country.countryCode,
                name: fromNullable(userCountry.s_country?.name),
            }))
        },
    });
}

export const getForecastTableData = async (
    sorting: TableSort<ForecastTableColumns>,
    filters: TableFilter<ForecastTableColumns>[],
    page: number,
    country: string,
    brand: number,
    seasonCode: number,
): Promise<HfsResult<TableResponse<ForecastTableColumns>>> => {
    // const searchParams = request.nextUrl.searchParams;
    // const start = Number(searchParams.get("start"));
    // const size = Number(searchParams.get("size"));
    // console.log(searchParams.get("sorting"));

    // const sorting: SortingState = JSON.parse(searchParams.get("sorting")!);
    // const search = searchParams.get("search")!;
    // const country = searchParams.get("country")!;
    // const brand = Number(searchParams.get("brand")!);
    // const seasonCode = Number(searchParams.get("season_code")!);

    const data = await getForecastTableDataMapper({
        sorting: Some(sorting),
        country,
        brand,
        season_code: seasonCode,
        filters: Some(filters),
        page,
    });
    console.log(data);

    return Ok(
        data,
    );
};

// export async function saveForecast(
//   row: ForecastTableData,
//   countryCode: string,
//   value: number,
// ): Promise<HfsResponse<{}>> {
//   const user = await getAccessTokenPayload();

//   if (user.err) {
//     return user.val;
//   }
//   const userId = Number(user.val.sub);
//   // Check if the user has access to the country
//   const hasCountry = await userHasCountry(userId, countryCode);

//   if (hasCountry.err) {
//     return hasCountry.val;
//   }
//   const itemNo = Number(row.item_no);
//   const colorCode = row.color_code;
//   const amount = value;

//   (await createForecast(itemNo, colorCode, countryCode, amount)).unwrap(); // we want to throw if there is an error, returning a 500

//   return { status: 200, data: {} };
// }
