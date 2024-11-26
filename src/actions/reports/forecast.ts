"use server";

import { Ok } from "ts-results";

import { getUserCountries, userHasCountry } from "@/lib/models/userHasCountry";
import { GetUserCountriesOkResponse, HfsResponse } from "@/types/responses";
import { HfsResult } from "@/lib/errors/HfsError";
import { getOrUpdateAccessToken } from "@/lib/models/user";
import { ForecastTableData } from "@/types/table";
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

  (await createForecast(itemNo, colorCode, countryCode, amount)).unwrap(); // we want to throw if there is an error, returning a 500

  return { status: 200, data: {} };
}
