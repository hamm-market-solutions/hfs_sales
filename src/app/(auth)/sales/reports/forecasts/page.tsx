"use server";

import { getUserCountriesAction } from "@/src/actions/reports/forecast";
import Title from "@/src/components/molecules/title";
import { getAllBrands } from "@/src/lib/models/brand";
import { GetUserCountriesOkResponse } from "@/src/types/responses";
import ForecastNavigation from "@/src/components/organism/forecastNavigation";
import { getAllSeasons } from "@/src/lib/models/season";
import { validateUserAuthorizedOrRedirect } from "@/src/lib/auth/validations";
import { routes } from "@/src/config/routes";
import * as O from "fp-ts/Option";
import { Some, unwrap } from "@/src/utils/fp-ts";

export default async function ForecastNavigationPage() {
  await validateUserAuthorizedOrRedirect(
    Some(routes.sales.reports.forecasts.base),
  );

  const userCountries = (
    unwrap(await getUserCountriesAction()) as GetUserCountriesOkResponse
  ).data;
  const brands = unwrap(await getAllBrands());
  const seasons = unwrap(await getAllSeasons());

  return (
    <div className="forecast-navigation-page">
      <Title
        subtitle={Some(
          "Select the country, brand and season you would like to view the forecast for:",
        )}
        title="Forecast - Navigation"
      />
      <ForecastNavigation
        brands={brands}
        seasons={seasons as { code: number; name: O.Option<string> }[]}
        userCountries={userCountries}
      />
    </div>
  );
}
