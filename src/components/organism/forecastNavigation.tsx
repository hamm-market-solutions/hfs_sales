"use client";

import { use, useState } from "react";
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
  const [country, setCountry] = useState("");
  const [oldCountry, setOldCountry] = useState("");
  const [brand, setBrand] = useState("");
  const [oldBrand, setOldBrand] = useState("");

  return (
    <TabNavigation
      // finalAction={(country: string, brand: string) => {
      //   // eslint-disable-next-line react-hooks/rules-of-hooks
      //   useRouter().push(
      //     `${routes.sales.reports.forecasts.base}/${country}/${brand}`,
      //   );
      // }}
      tabs={[
        {
          key: "country",
          name: "Country",
          node: <CountryNavigation userCountries={userCountries} />,
          state: [country, setCountry],
          oldState: [oldCountry, setOldCountry],
        },
        {
          key: "brand",
          name: "Brand",
          node: <BrandNavigation brands={brands} />,
          state: [brand, setBrand],
          oldState: [oldBrand, setOldBrand],
        },
      ]}
    />
  );
}
