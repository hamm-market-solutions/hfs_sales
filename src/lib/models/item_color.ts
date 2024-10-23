import { Err, Ok } from "ts-results";
import HfsError, { HfsResult } from "../errors/HfsError";
import prisma from "../prisma";
import ItemColorModelError from "../errors/ItemColorModelError";
import { ForecastTableData, ForecastTableRequest } from "@/types/table";

export const getForecastItemColorData = async ({
    start,
    size,
    sorting,
    country,
    brand,
    season_code,
  }: ForecastTableRequest) => {
    try {
        console.log("brand", brand, "season_code", season_code, start, size);

        return Ok(
          await prisma.s_item_color.findMany({
            select: {
                s_item: {
                    select: {
                        brand_no: true,
                        season_code: true,
                        description: true,
                        min_qty_style: true,
                    },
                },
                pre_collection: true,
                main_collection: true,
                late_collection: true,
                Special_collection: true,
                item_no: true,
                color_code: true,
                purchase_price: true,
            },
            // where: {
            //     s_item: {
            //         // brand_no: brand,
            //         season_code: season_code,
            //     },
            // },
            skip: start,
            take: size,
          }),
        );
      } catch (error) {
        return Err(
          HfsError.fromThrow(500, ItemColorModelError.getForecastDataError(), error as Error),
        );
      }
}