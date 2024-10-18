import { CardFooter } from "@nextui-org/card";

import { PicCards } from "./picCards";

import { brandLogos } from "@/lib/brands";

export function BrandNavigation({
  brands,
  brandSetter,
}: {
  brands: { code: string; name: string }[];
  brandSetter?: (brand: string) => void;
}) {
  const dataSets = brands.map((brand) => ({
    key: brand.code,
    // @ts-ignore
    pic: brandLogos[brand.name.toLowerCase()].pic,
    // @ts-ignore
    bgColor: brandLogos[brand.name.toLowerCase()].bgColor,
    footer: (
      <CardFooter className="flex flex-col items-start">
        <p className="text-tiny uppercase font-bold">{brand.name}</p>
        <small className="text-primary">{brand.code}</small>
      </CardFooter>
    ),
  }));

  return (
    <div className="brand-navigation flex flex-wrap justify-between gap-4">
      <PicCards dataSets={dataSets} dataSetter={brandSetter} />
    </div>
  );
}
