"use server";

import ForecastVsSalesChart from "@/components/molecules/charts/forecastVsSalesChart";
import { getSumForecastForLastFiveSeasons, getSumForecastForSeason } from "@/lib/models/forecast";
import { getQtyPairSumPerSeason } from "@/lib/models/purchaseLine";

export default async function SalesDashboard() {
  const forecastQty = (await getSumForecastForLastFiveSeasons()).unwrap();
  const expected = forecastQty.map((forecast) => ({
    name: forecast.seasonCode.toString(),
    value: forecast.sumQty,
  }));
  const orderQty = forecastQty.map(async (forecast) => {
    const qtyPairSum = (await getQtyPairSumPerSeason(forecast.seasonCode)).unwrap();
    return Number(qtyPairSum.qtyPairSum) / 1000;
  });
  const actual = await Promise.all(orderQty);

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
