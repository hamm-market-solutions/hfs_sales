import React from "react";

import Title from "@/components/molecules/title";
import ForecastTable from "@/components/organism/tables/forecastTable";

export default function Forecast() {
  return (
    <div className="forecast-page">
      <Title subtitle="" title="Forecast" />
      <ForecastTable />
    </div>
  );
}
