"use client";

import { useState } from "react";

import { BrandNavigation } from "../molecules/brandNavigation";
import { CountryNavigation } from "../molecules/countryNavigation";
import MultiSectionFadeOut from "../molecules/multiSectionFadeOut";

export default function ForecastNavigation({
  userCountries,
  brands,
}: {
  userCountries: { countries: { code: string; name: string }[] };
  brands: { code: string; name: string }[];
}) {
  const [country, setCountry] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(1);

  if (country !== "") {
    setActiveSectionIndex(activeSectionIndex + 1);
  } else if (country !== "" && brand !== "") {
    // // eslint-disable-next-line react-hooks/rules-of-hooks
    // useRouter().push(
    //   `${appConfig.url}/sales/reports/forecasts/${country}/${brand}`,
    // );
  }

  return (
    <MultiSectionFadeOut
      activeSectionIndex={activeSectionIndex}
      sections={[
        {
          key: "country",
          name: "Country",
          node: (
            <CountryNavigation
              countrySetter={setCountry}
              userCountries={userCountries}
            />
          ),
        },
        {
          key: "brand",
          name: "Brand",
          node: <BrandNavigation brandSetter={setBrand} brands={brands} />,
        },
      ]}
    />
  );
}
