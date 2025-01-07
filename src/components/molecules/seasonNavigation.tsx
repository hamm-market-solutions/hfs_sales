import { CardFooter } from "@nextui-org/card";

import SeasonImage from "../atoms/seasonImage";

import { PicCards } from "./picCards";

export default function SeasonNavigation({
    seasons,
    seasonSetter,
}: {
  seasons: { code: number; name?: string }[];
  seasonSetter?: (season: string) => void;
}) {
    const dataSets = seasons.map((season) => ({
        key: season.code.toString(),
        picComponent: SeasonImage({ code: season.code, name: season.name }),
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
