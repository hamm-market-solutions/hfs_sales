"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandNavigation } from "../molecules/brandNavigation";
import { CountryNavigation } from "../molecules/countryNavigation";
import TabNavigation from "../molecules/tabNavigation";

import { routes } from "@/config/routes";

export default function ForecastNavigation({
  userCountries,
  brands,
}: {
  userCountries: { countries: { code: string; name: string }[] };
  brands: { code: string; name: string }[];
}) {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [oldCountry, setOldCountry] = useState("");
  const [brand, setBrand] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [oldActiveTabIndex, setOldActiveTabIndex] = useState(0);

  if (activeTabIndex !== oldActiveTabIndex) {
    setOldActiveTabIndex(activeTabIndex);
    if (activeTabIndex === 0) {
      setCountry("");
      setOldCountry("");
      setBrand("");
    }
  }

  if (country !== oldCountry) {
    setOldCountry(country);
    setActiveTabIndex(1);
  }

  useEffect(() => {
    if (brand && country) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      router.push(`${routes.sales.reports.forecasts.base}/${country}/${brand}`);
    }
  }, [router, brand, country]);

  return (
    <TabNavigation
      activeTabIndexState={[activeTabIndex, setActiveTabIndex]}
      tabs={[
        {
          key: "country",
          name: "Country",
          node: (
            <CountryNavigation
              countries={userCountries.countries}
              countrySetter={setCountry}
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
