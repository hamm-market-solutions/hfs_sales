"use server";

import { Ok } from "ts-results";

import { getUserCountries, userHasCountry } from "@/lib/models/userHasCountry";
import { GetUserCountriesOkResponse, HfsResponse } from "@/types/responses";
import HfsError, { HfsResult } from "@/lib/errors/HfsError";
import { getOrUpdateAccessToken } from "@/lib/models/user";
import { getForecastData } from "@/lib/tables/forecast";
import {
  ForecastTableData,
  ForecastTableRequest,
  TableResponse,
} from "@/types/table";
import { createForecast } from "@/lib/models/forecast";
import { getAccessTokenPayload } from "@/lib/auth/jwt";

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

export async function getForecastTableData({
  start,
  size,
  sorting,
  country,
  brand,
  season_code,
}: ForecastTableRequest): Promise<TableResponse<ForecastTableData>> {
  const data = await getForecastData({
    start,
    size,
    sorting,
    country,
    brand,
    season_code,
  });

  return data;
}

export async function saveForecast(
  row: ForecastTableData,
  countryCode: string,
  value: number,
): Promise<HfsResponse<{}>> {
  const user = await getAccessTokenPayload();

  if (user.err) {
    return user.val;
  }
  const userId = Number(user.val.sub);
  // Check if the user has access to the country
  const hasCountry = await userHasCountry(userId, countryCode);

  if (hasCountry.err) {
    return hasCountry.val;
  }
  const itemNo = Number(row.item_no);
  const colorCode = row.color_code;
  const amount = value;

  // if (amount <= 0) {
  //   return new HfsError(400, "Amount must be greater than 0");
  // }

  (await createForecast(itemNo, colorCode, countryCode, amount)).unwrap(); // we want to throw if there is an error, returning a 500

  return { status: 200, data: {} };
}
