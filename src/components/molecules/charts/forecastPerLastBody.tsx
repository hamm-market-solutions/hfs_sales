"use client";

import { getLastForecastsAction } from "@/actions/reports/forecast";
import { HfsError } from "@/lib/errors/HfsError";
import {  isErr, unwrap, unwrapOr } from "@/utils/fp-ts";
import {  CardBody } from "@heroui/card";
import { Listbox } from "@heroui/listbox";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { Option } from "fp-ts/lib/Option";
import { useEffect, useState } from "react";

export default function ForecastPerLastBody({ seasons }: {seasons: {
    code: number;
    name: Option<string>;
}[]}) {
    const [season, setSeason] = useState<number>(seasons[0].code);
    const [forecasts, setForecasts] = useState<{
        last: string;
        amount: number;
    }[]>([]);
    const [error, setError] = useState<HfsError|undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleFetchData = async () => {
        setIsLoading(true);
        const forecastsRes = await getLastForecastsAction(season);
        if (isErr(forecastsRes)) {
            setError(forecastsRes.right);
        } else {
            setError(undefined);
        }

        setForecasts(unwrap(forecastsRes));
        setIsLoading(false);
    }

    useEffect(() => {
        handleFetchData();
    }, [season]);

    return (
        <CardBody className="max-h-[350px]">
            <Select
                defaultSelectedKeys={[season.toString()]}
                className="w-full"
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
            {!isLoading ? !error ?
                <Listbox variant="light">
                    {forecasts.map((forecast) => (
                        <SelectItem aria-label="The forecasted amount per last" key={forecast.last} value={forecast.amount}>
                            <div className="flex justify-between">
                                <span>{forecast.last}</span>
                                <span>{forecast.amount}</span>
                            </div>
                        </SelectItem>
                    ))}
                </Listbox> :
                error.message : <Spinner />}
        </CardBody>
    )
}