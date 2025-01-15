"use server";

import React from "react";

import Title from "@/src/components/molecules/title";
import ForecastTable from "@/src/components/organism/tables/forecastTable";
import { validateUserAuthorizedOrRedirect } from "@/src/lib/auth/validations";
import { routes } from "@/src/config/routes";
import { isSeasonActive } from "@/src/lib/models/seasonBrandPhase";
import { Some, unwrapOr } from "@/src/utils/fp-ts";

export default async function Forecast({
  params,
}: {
  params: Promise<{ seasonCode: string }>;
}) {
  await validateUserAuthorizedOrRedirect(
    Some(
      routes.sales.reports
        .forecasts["[countryId]"]["[brandId]"]["[seasonCode]"],
    ),
  );
  const seasonCode = Number((await params).seasonCode);
  const seasonIsActive = unwrapOr(await isSeasonActive(seasonCode), false);
  const subtitle = "Estimate the sales for the upcoming season";

  return (
    <div className="forecast-page">
      <Title
        subtitle={Some(
          seasonIsActive
            ? subtitle
            : `${subtitle} - The season you are viewing is inactive`,
        )}
        title="Forecast"
      />
      <ForecastTable isSeasonActive={seasonIsActive} />
    </div>
  );
}
