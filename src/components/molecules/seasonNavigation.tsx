import { CardFooter } from "@nextui-org/card";

import { PicCards } from "./picCards";

export function seasonNavigation({
  seasons,
  seasonSetter,
}: {
  seasons: { code: string; name: string }[];
  seasonSetter?: (season: string) => void;
}) {
  const dataSets = seasons.map((season) => ({
    key: season.code,
    picComponent: <svg viewBox="0 0 500 500" width="500px" height="500px" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com"><defs><bx:export><bx:file format="svg" path="Unbetitelt.svg"/></bx:export></defs><text style="fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 150px; font-weight: 700; white-space: pre;" x="166.58" y="302.103">31</text></svg></div>,
    footer: (
      <CardFooter className="flex flex-col items-start">
        <p className="text-tiny uppercase font-bold">{season.name}</p>
        <small className="text-primary">{season.code}</small>
      </CardFooter>
    ),
  }));

  return (
    <div className="season-navigation flex flex-wrap justify-between gap-4">
      <PicCards dataSets={dataSets} dataSetter={seasonSetter} />
    </div>
  );
}
