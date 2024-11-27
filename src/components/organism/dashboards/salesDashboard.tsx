"use server";

import ForecastVsSalesChart from "@/components/molecules/charts/forecastVsSalesChart";

export default async function SalesDashboard() {
  return (
    <section className="sales-dashboard grid grid-cols-2 gap-4 place-items-center">
      <ForecastVsSalesChart
        actual={[3010, 3100]}
        expected={[
          { name: "30", value: 3210 },
          { name: "31", value: 2034 },
        ]}
        options={{}}
      />
    </section>
  );
}
