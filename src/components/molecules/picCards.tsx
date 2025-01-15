import { unwrapOr } from "@/src/utils/fp-ts.ts";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import React from "react";
import { Option } from "fp-ts/Option";

export type PicCardsData = {
  key: string;
  src: string;
  picComponent: Option<React.ReactNode>;
  footer: Option<React.ReactNode>;
  bgColor: Option<string>;
};

export function PicCards({
  dataSets,
  dataSetter,
}: {
  dataSets: PicCardsData[];
  dataSetter: (data: string) => void;
}) {
  const countryCards = [];

  for (const data of dataSets) {
    countryCards.push(
      <Card
        key={data.key}
        isPressable
        className="max-w-48 max-h-56"
        onPress={() => {
          dataSetter(data.key);
        }}
      >
        <CardBody className="flex items-center place-content-start p-0">
          {data.src
            ? (
              <Image
                alt={data.key}
                className={`max-w-48 max-h-36 ${unwrapOr(data.bgColor, "")}`}
                src={data.src}
              />
            )
            : (
              unwrapOr(data.picComponent, null)
            )}
        </CardBody>
        {unwrapOr(data.footer, null)}
      </Card>,
    );
  }

  return (
    <section className="forecast-overview flex flex-wrap justify-between gap-4">
      {countryCards}
    </section>
  );
}
