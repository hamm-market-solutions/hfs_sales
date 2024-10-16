import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export const ForecastCountryNavigation = async ({
  userCountries,
}: {
  userCountries: { countries: { code: string; name: string }[] };
}) => {
  let countryCards = [];

  for (const country of userCountries.countries) {
    countryCards.push(
      <Card key={country.code} className="min-h-52">
        <CardBody className="flex items-center place-content-center">
          <Image
            alt={country.name}
            src={`https://flagcdn.com/h120/${country.code.toLowerCase()}.png`}
          />
        </CardBody>
        <CardFooter className="flex flex-col items-start">
          <p className="text-tiny uppercase font-bold">{country.name}</p>
          <small className="text-primary">{country.code}</small>
        </CardFooter>
      </Card>,
    );
  }

  return (
    <section className="forecast-overview flex flex-wrap gap-4">
      {countryCards}
    </section>
  );
};
