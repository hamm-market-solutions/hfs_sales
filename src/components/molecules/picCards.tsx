import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import React from "react";

export function PicCards({
  dataSets,
  dataSetter,
}: {
  dataSets: {
    key: string;
    pic: string;
    footer: React.ReactNode;
    bgColor?: string;
  }[];
  dataSetter?: (data: string) => void;
}) {
  let countryCards = [];

  for (const data of dataSets) {
    countryCards.push(
      <Card
        key={data.key}
        isPressable
        className="max-w-48 max-h-52"
        onPress={() => {
          dataSetter?.(data.key);
        }}
      >
        <CardBody className="flex items-center place-content-center p-0">
          <Image
            alt={data.key}
            className={`w-48 ${data.bgColor ?? ""}`}
            src={data.pic}
          />
        </CardBody>
        {data.footer}
      </Card>,
    );
  }

  return (
    <section className="forecast-overview flex flex-wrap justify-between gap-4">
      {countryCards}
    </section>
  );
}
