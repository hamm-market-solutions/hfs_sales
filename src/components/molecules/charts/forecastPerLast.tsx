import { getAllSeasons } from "@/lib/models/season";
import { isErr } from "@/utils/fp-ts";
import { Card, CardHeader } from "@nextui-org/card";
import ForecastPerLastBody from "./forecastPerLastBody";
import React from "react";

export default async function ForecastPerLast() {
  const seasons = await getAllSeasons();

  if (isErr(seasons)) {
    return <></>;
  }

  return (
    <Card shadow="sm">
      <CardHeader>
        <p className="text-primary font-bold">Forecast Per Last</p>
      </CardHeader>
      <ForecastPerLastBody seasons={seasons.left} />
    </Card>
  );
}
