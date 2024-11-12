// "use server";
"use client";

// import { getUserCountriesAction } from "@/actions/reports/forecast";
// import Title from "@/components/molecules/title";
// import { getAllBrands } from "@/lib/models/brand";
// import { GetUserCountriesOkResponse } from "@/types/responses";
// import ForecastNavigation from "@/components/organism/forecastNavigation";
// import { getAllSeasons } from "@/lib/models/season";

// export default async function ForecastNavigationPage() {
//   const userCountries = (
//     (await getUserCountriesAction()).unwrap() as GetUserCountriesOkResponse
//   ).data;
//   const brands = (await getAllBrands()).unwrap();
//   const seasons = (await getAllSeasons()).unwrap();

//   return (
//     <div className="forecast-navigation-page">
//       <Title
//         subtitle="Select the country and brand you would like to view the forecast for:"
//         title="Forecast - Navigation"
//       />
//       <ForecastNavigation
//         brands={brands}
//         seasons={seasons as { code: number; name: string | undefined }[]}
//         userCountries={userCountries}
//       />
//     </div>
//   );
// }
export default async function ForecastNavigationPage() {
  return <></>;
}
