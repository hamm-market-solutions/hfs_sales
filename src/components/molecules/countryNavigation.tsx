import { CardFooter } from "@nextui-org/card";

import { PicCards } from "./picCards";

export function CountryNavigation({
  countries,
  countrySetter,
}: {
  countries: { code: string; name?: string }[];
  countrySetter?: (country: string) => void;
}) {
  const dataSets = countries.map((country) => ({
    key: country.code,
    pic: `/assets/flags/${country.code.toLowerCase()}.svg`,
    footer: (
      <CardFooter className="flex flex-col items-start">
        <p className="text-tiny uppercase font-bold">{country.name}</p>
        <small className="text-primary">{country.code}</small>
      </CardFooter>
    ),
  }));

  return (
    <div className="country-navigation flex flex-wrap justify-between gap-4">
      <PicCards dataSets={dataSets} dataSetter={countrySetter} />
    </div>
  );
}
