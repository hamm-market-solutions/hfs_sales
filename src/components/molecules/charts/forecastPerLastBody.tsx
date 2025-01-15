"use client";

import { getLastForecastsAction } from "@/src/actions/reports/forecast.ts";
import { HfsError } from "@/src/lib/errors/HfsError.ts";
import { isErr, unwrap, unwrapOr } from "@/src/utils/fp-ts.ts";
import { CardBody } from "@nextui-org/card";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { Option } from "fp-ts/lib/Option";
import React from "react";
import { useEffect, useState } from "react";

export default function ForecastPerLastBody({ seasons }: {
  seasons: {
    code: number;
    name: Option<string>;
  }[];
}) {
  const [season, setSeason] = useState<number>(seasons[0].code);
  const [_forecasts, setForecasts] = useState<{
    last: string;
    amount: number;
  }[]>([]);
  const [error, setError] = useState<HfsError | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFetchData = async () => {
    setIsLoading(true);

    console.log("fetching forecasts for season", season);

    const forecastsRes = await getLastForecastsAction(season);
    if (isErr(forecastsRes)) {
      setError(forecastsRes.right);
    } else {
      setError(undefined);
    }

    setForecasts(unwrap(forecastsRes));
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchData();
  }, [season]);

  return (
    <CardBody className="h-[350px] w-[450px] gap-6">
      <Select
        defaultSelectedKeys={[season.toString()]}
        className="max-w-xs"
        label="Season"
        value={season}
        onSelectionChange={(e) => setSeason(Number(e.currentKey))}
      >
        {seasons.map((season) => (
          <SelectItem key={season.code.toString()} value={season.code}>
            {unwrapOr(season.name, "Unknown")}
          </SelectItem>
        ))}
      </Select>
      {!isLoading
        ? !error ? JSON.stringify(_forecasts) : error.message
        : <Spinner />}
    </CardBody>
  );
}
