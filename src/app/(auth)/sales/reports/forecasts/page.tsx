"use server";

import { getUserCountriesAction } from "@/actions/reports/forecast";
import Title from "@/components/molecules/title";
import { getAllBrands } from "@/lib/models/brand";
import { GetUserCountriesOkResponse } from "@/types/responses";
import ForecastNavigation from "@/components/organism/forecastNavigation";

export default async function ForecastNavigationPage() {
  const userCountries = (
    (await getUserCountriesAction()).unwrap() as GetUserCountriesOkResponse
  ).data;
  const brands = (await getAllBrands()).unwrap();

  return (
    <div className="forecast-navigation-page">
      <Title
        subtitle="Select the country and brand you would like to view the forecast for:"
        title="Forecast - Navigation"
      />
      <ForecastNavigation brands={brands} userCountries={userCountries} />
    </div>
  );
}
