import { NextResponse } from "next/server";
import { Ok } from "ts-results";

import { getAccessTokenPayload } from "@/lib/auth/jwt";
import { getUserCountries } from "@/lib/models/user_has_country";
import { GetUserCountriesResponse } from "@/types/responses";
import { resultToResponse } from "@/utils/conversions";

export async function GET(): Promise<NextResponse<GetUserCountriesResponse>> {
  const payloadRes = await getAccessTokenPayload();

  if (payloadRes.err) {
    return resultToResponse(payloadRes);
  }
  const userId = Number(payloadRes.val.sub!);
  const userCountriesRes = await getUserCountries(userId);

  if (userCountriesRes.err) {
    return resultToResponse(userCountriesRes);
  }

  return resultToResponse(
    Ok({
      countries: userCountriesRes.val.map((userCountry) => ({
        code: userCountry.country_code,
        name: userCountry.s_country.name,
      })),
    }),
  );
}
