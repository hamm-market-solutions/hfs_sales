import { getUserCountries } from "@/actions/reports/forecast";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export const ForecastNavigation = async () => {
  const userCountries = (await getUserCountries()).unwrap().data;
  let countryCards = [];

  for (const [name, code] of Object.entries(userCountries)) {
    countryCards.push(
      <Card>
        <CardHeader>{name}</CardHeader>
        <CardBody>
          <Image alt={name} src={`https://flagcdn.com/w160/${code}.png`} />
        </CardBody>
        <CardFooter>{code}</CardFooter>
      </Card>,
    );
  }

  return (
    <section className="forecast-overview grid grid-cols-2 gap-4">
      Forecast Navigation Component
    </section>
  );
};
