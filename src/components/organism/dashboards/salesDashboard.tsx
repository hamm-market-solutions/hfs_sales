"use server";

import ForecastVsSalesChart from "@/components/molecules/charts/forecastVsSalesChart";
import { getSumForecastForLastFiveSeasons } from "@/lib/models/forecast";
import { getQtyPairSumPerSeason } from "@/lib/models/purchaseLine";
import { unwrap } from "@/utils/fp-ts";

export default async function SalesDashboard() {
    const forecastQty = unwrap((await getSumForecastForLastFiveSeasons()));
    const expected = forecastQty.map((forecast) => ({
        name: forecast.seasonCode.toString(),
        value: forecast.sumQty,
    }));
    const orderQty = forecastQty.map(async (forecast) => {
        const qtyPairSum = unwrap((await getQtyPairSumPerSeason(forecast.seasonCode)));
        return Number(qtyPairSum.qtyPairSum) / 1000;
    });
    const actual = await Promise.all(orderQty);

    console.log({ expected, actual });


    return (
        <section className="sales-dashboard grid grid-cols-2 gap-4 place-items-center">
            <ForecastVsSalesChart
                actual={actual}
                expected={expected}
                options={{}}
            />
        </section>
    );
}
