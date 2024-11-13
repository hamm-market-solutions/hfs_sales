import { CardFooter } from "@nextui-org/card";

import { PicCards } from "./picCards";

import { brandLogos } from "@/lib/brands";
import { Brand } from "@/types/brands";

export function BrandNavigation({
  brands,
  brandSetter,
}: {
  brands: { no: string; code: string; name: string }[];
  brandSetter?: (brand: string) => void;
}) {
  const dataSets = brands.map((brand) => {
    const brandName = brand.name.toLowerCase() as Brand;
    const brandLogo = brandLogos[brandName];
    return {
      key: brand.no.toString(),
      pic: brandLogo.pic,
      bgColor: brandLogo.bgColor,
      footer: (
        <CardFooter className="flex flex-col items-start">
          <p className="text-tiny uppercase font-bold">{brand.name}</p>
          <small className="text-primary">{brand.code}</small>
        </CardFooter>
      ),
    }
  });

  return (
    <div className="brand-navigation flex flex-wrap justify-between gap-4">
      <PicCards dataSets={dataSets} dataSetter={brandSetter} />
    </div>
  );
}
