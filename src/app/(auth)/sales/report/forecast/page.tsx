import { getUserCountries } from "@/actions/reports/forecast";
import Title from "@/components/molecules/title";
import { ForecastCountryNavigation } from "@/components/organism/forecastCountryNavigation";
import MultiSectionFadeOut from "@/components/organism/multiSectionFadeOut";
import { GetUserCountriesOkResponse } from "@/types/responses";

export default async function ForecastNavigation() {
  const userCountries = (
    (await getUserCountries()).unwrap() as GetUserCountriesOkResponse
  ).data;

  return (
    <div className="forecast-navigation-page">
      <Title
        subtitle="Select a country you would like to view the forecast for:"
        title="Forecast - Country Selection"
      />
      <MultiSectionFadeOut
        sections={[
          {
            name: "Country",
            node: <ForecastCountryNavigation userCountries={userCountries} />,
            // nextNodeLogic: () => false,
          },
        ]}
      />
    </div>
  );
}
