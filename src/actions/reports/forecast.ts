"use server";

import { Ok } from "ts-results";

import { getUserCountries} from "@/lib/models/userHasCountry";
import { GetUserCountriesOkResponse } from "@/types/responses";
import { HfsResult } from "@/lib/errors/HfsError";
import { getOrUpdateAccessToken } from "@/lib/models/user";
import { ForecastTableColumns, TableResponse, TableSorting } from "@/types/table";
import { getForecastTableDataMapper } from "@/lib/tables/forecast";

export async function getUserCountriesAction(): Promise<
    HfsResult<GetUserCountriesOkResponse>
    > {
    const payloadRes = await getOrUpdateAccessToken();

    if (payloadRes.err) {
        return payloadRes;
    }
    const userId = Number(payloadRes.val.accessToken[1].sub!);
    const userCountriesRes = await getUserCountries(userId);

    if (userCountriesRes.err) {
        return userCountriesRes;
    }

    return Ok({
        status: 200,
        data: {
            countries: userCountriesRes.val.map((userCountry) => ({
                code: userCountry.user_has_country.countryCode,
                name: userCountry.s_country?.name,
            })),
        },
    });
}

export const getForecastTableData = async (
    sorting: TableSorting<ForecastTableColumns>,
    search: string,
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
        sorting,
        country,
        brand,
        season_code: seasonCode,
        search,
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
