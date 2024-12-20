"use server";

import React from "react";

import Title from "@/components/molecules/title";
import ForecastTable from "@/components/organism/tables/forecastTable";
import { validateUserAuthorizedOrRedirect } from "@/lib/auth/validations";
import { routes } from "@/config/routes";
import { isSeasonActive } from "@/lib/models/seasonBrandPhase";

export default async function Forecast({
  params,
}: {
  params: Promise<{ seasonCode: string }>;
}) {
  await validateUserAuthorizedOrRedirect(
    routes.sales.reports.forecasts["[countryId]"]["[brandId]"]["[seasonCode]"],
  );
  const seasonCode = Number((await params).seasonCode);
  const seasonIsActive = (await isSeasonActive(seasonCode)).unwrapOr(false);
  const subtitle = "Estimate the sales for the upcoming season";

  return (
    <div className="forecast-page">
      <Title
        subtitle={
          seasonIsActive
            ? subtitle
            : `${subtitle} - The season you are viewing is inactive`
        }
        title="Forecast"
      />
      <ForecastTable isSeasonActive={seasonIsActive} />
    </div>
  );
}
