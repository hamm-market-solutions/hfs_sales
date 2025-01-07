"use server";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { ApexOptions } from "apexcharts";

import ExpectedVsActualChart from "./expectedVsActualChart";

export default async function ForecastVsSalesChart({
    expected,
    actual,
    options,
}: {
  expected: { name: string; value: number }[];
  actual: number[];
  options: ApexOptions;
}) {
    return (
        <Card shadow="sm">
            <CardHeader>
                <p className="text-primary font-bold">Forecast vs Order Qty.</p>
            </CardHeader>
            <CardBody className="h-[350px] w-[450px]">
                <ExpectedVsActualChart
                    actual={actual}
                    expected={expected}
                    options={options}
                />
            </CardBody>
        </Card>
    );
}
