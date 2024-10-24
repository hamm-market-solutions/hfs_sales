import { Ok } from "ts-results";

import { getUserCountries } from "@/lib/models/user_has_country";
import { GetUserCountriesOkResponse } from "@/types/responses";
import { HfsResult } from "@/lib/errors/HfsError";
import { getOrUpdateAccessToken } from "@/lib/models/user";
import { getForecastData } from "@/lib/tables/forecast";
import {
  ForecastTableData,
  ForecastTableRequest,
  TableResponse,
} from "@/types/table";

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
        code: userCountry.country_code,
        name: userCountry.s_country.name,
      })),
    },
  });
}

export async function getForecastTableData({
  start,
  size,
  sorting,
  country,
  brand,
  season_code,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableData>> {
  const data = await getForecastData({ start, size, sorting, country, brand, season_code });
  console.log(data);

  return data;
}
