import { CardFooter } from "@nextui-org/card";

import { PicCards } from "./picCards";
import { Option } from "fp-ts/Option";
import { None, Some, unwrapOr } from "@/utils/fp-ts";

export function CountryNavigation({
  countries,
  countrySetter,
}: {
  countries: { code: string; name: Option<string> }[];
  countrySetter: (country: string) => void;
}) {
  if (countries.length === 0) {
    return (
      <p>
        No countries assigned to the user. Please get in touch with your contact
        person.
      </p>
    );
  }

  const dataSets = countries.map((country) => ({
    key: country.code,
    src: `/assets/flags/${country.code.toLowerCase()}.svg`,
    footer: Some(
      (
        <CardFooter className="flex flex-col items-start">
          <p className="text-tiny uppercase font-bold">
            {unwrapOr(country.name, "")}
          </p>
          <small className="text-primary">{country.code}</small>
        </CardFooter>
      ),
    ),
    picComponent: None,
    bgColor: None,
  }));

  return (
    <div className="country-navigation flex flex-wrap justify-between gap-4">
      <PicCards dataSets={dataSets} dataSetter={countrySetter} />
    </div>
  );
}
