import { CardFooter } from "@nextui-org/card";

import { PicCards, PicCardsData } from "./picCards";

import { brandLogos } from "@/lib/brands";
import { Brand } from "@/types/brands";
import { None, Some } from "ts-results";

export function BrandNavigation({
    brands,
    brandSetter,
}: {
  brands: { no: string; code: string; name: string }[];
  brandSetter: (brand: string) => void;
}) {
    const dataSets: PicCardsData[] = brands.map((brand) => {
        const brandName = brand.name.toLowerCase() as Brand;
        const brandLogo = brandLogos[brandName];

        return {
            key: brand.no.toString(),
            src: brandLogo.pic,
            bgColor: Some(brandLogo.bgColor),
            footer: Some((
                <CardFooter className="flex flex-col items-start">
                    <p className="text-tiny uppercase font-bold">{brand.name}</p>
                    <small className="text-primary">{brand.code}</small>
                </CardFooter>
            )),
            picComponent: None,
        };
    });

    return (
        <div className="brand-navigation flex flex-wrap justify-between gap-4">
            <PicCards dataSets={dataSets} dataSetter={brandSetter} />
        </div>
    );
}
