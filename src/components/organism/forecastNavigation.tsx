"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandNavigation } from "../molecules/brandNavigation";
import { CountryNavigation } from "../molecules/countryNavigation";
import TabNavigation from "../molecules/tabNavigation";
import SeasonNavigation from "../molecules/seasonNavigation";

import { routes } from "@/config/routes";

export default function ForecastNavigation({
    userCountries,
    brands,
    seasons,
}: {
  userCountries: { countries: { code: string; name?: string }[] };
  brands: { no: string; code: string; name: string }[];
  seasons: { code: number; name?: string }[];
}) {
    const router = useRouter();
    const [country, setCountry] = useState("");
    const [oldCountry, setOldCountry] = useState("");
    const [brand, setBrand] = useState("");
    const [oldBrand, setOldBrand] = useState("");
    const [season, setSeason] = useState("");
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [oldActiveTabIndex, setOldActiveTabIndex] = useState(0);

    if (activeTabIndex !== oldActiveTabIndex) {
        setOldActiveTabIndex(activeTabIndex);
        if (activeTabIndex === 0) {
            setCountry("");
            setOldCountry("");
            setBrand("");
            setOldBrand("");
        }
        if (activeTabIndex === 1) {
            setBrand("");
            setOldBrand("");
            setSeason("");
            setOldBrand("");
        }
    }

    if (country !== oldCountry) {
        setOldCountry(country);
        setActiveTabIndex(1);
    }

    if (brand !== oldBrand) {
        setOldBrand(brand);
        setActiveTabIndex(2);
    }

    useEffect(() => {
        if (brand && country && season) {
            router.push(
                `${routes.sales.reports.forecasts.base}/${country.toLowerCase()}/${brand.toLowerCase()}/${season}`,
            );
        }
    }, [router, brand, country, season]);

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
                {
                    key: "season",
                    name: "Season",
                    node: <SeasonNavigation seasonSetter={setSeason} seasons={seasons} />,
                },
            ]}
        />
    );
}
