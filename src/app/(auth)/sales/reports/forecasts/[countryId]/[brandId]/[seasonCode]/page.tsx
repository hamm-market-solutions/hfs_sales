"use server";

import React from "react";

import Title from "@/components/molecules/title";
import ForecastTable from "@/components/organism/tables/forecastTable";
import { validateUserAuthorizedOrRedirect } from "@/lib/auth/validations";
import { routes } from "@/config/routes";

export default async function Forecast() {
  await validateUserAuthorizedOrRedirect(
    routes.sales.reports.forecasts["[countryId]"]["[brandId]"]["[seasonCode]"],
  );

  return (
    <div className="forecast-page">
      <Title subtitle="" title="Forecast" />
      <ForecastTable />
    </div>
  );
}
