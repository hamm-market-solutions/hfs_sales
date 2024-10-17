import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import React, { useCallback } from "react";

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
  dataSetter: (data: string) => void;
}) {
  let countryCards = [];

  const handlePress = useCallback(
    (key: string) => {
      dataSetter(key);
    },
    [dataSetter], // Make sure this does not change unnecessarily
  );

  for (const data of dataSets) {
    countryCards.push(
      <Card
        key={data.key}
        isPressable
        onPress={() => {
          handlePress(data.key);
        }}
      >
        <CardBody className="flex items-center place-content-center p-0">
          <Image
            alt={data.key}
            className={`w-48 ${data.bgColor ?? ""} p-4`}
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
