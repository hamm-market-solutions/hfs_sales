"use server";

// import { getSumForecastForLastFiveSeasons } from "@/lib/models/forecast";
// import { getQtyPairSumPerSeason } from "@/lib/models/purchaseLine";
import { unwrap } from "@/utils/fp-ts";
import NavSuggestion from "../navBar/navSuggestion";
import { navigationTree } from "@/config/navigation";
import ForecastPerLast from "@/components/molecules/charts/forecastPerLast";

export default async function SalesDashboard() {
    // const forecastQty = unwrap((await getSumForecastForLastFiveSeasons()));
    // const expected = forecastQty.map((forecast) => ({
    //     name: forecast.seasonCode.toString(),
    //     value: forecast.sumQty,
    // }));
    // const orderQty = forecastQty.map(async (forecast) => {
    //     const qtyPairSum = unwrap((await getQtyPairSumPerSeason(forecast.seasonCode)));
    //     return Number(qtyPairSum.qtyPairSum) / 1000;
    // });
    // const actual = await Promise.all(orderQty);

    // console.log({ expected, actual });


    return (
        <>
            <div className="flex flex-row gap-2 mb-4">
                <NavSuggestion suggestion={unwrap(navigationTree[1].items)[0]} />
            </div>
            <section className="sales-dashboard grid grid-cols-2 gap-4 place-items-center">
                <ForecastPerLast />
            </section>
        </>
    );
}
