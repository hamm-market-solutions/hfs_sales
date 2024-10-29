import { Err, Ok } from "ts-results";

import HfsError, { HfsResult } from "../errors/HfsError";
import prisma from "../prisma";
import ItemColorModelError from "../errors/ItemColorModelError";

import { ForecastTableData, ForecastTableRequest } from "@/types/table";
import { sortingToPrisma } from "@/utils/conversions";
import { deepCopy } from "@/utils/objects";

export const getForecastItemColorData = async ({
  start,
  size,
  sorting,
  country,
  brand,
  season_code,
}: ForecastTableRequest) => {
  try {
    const select = {
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
    };
    const selectClone = deepCopy(select);
    const orderBy = sortingToPrisma(selectClone, sorting);

    return Ok(
      await prisma.s_item_color.findMany({
        select: select,
        where: {
            s_item: {
                brand_no: brand,
                season_code: season_code,
            },
        },
        orderBy: orderBy,
        skip: start,
        take: size,
      }),
    );
  } catch (error) {
    return Err(
      HfsError.fromThrow(
        500,
        ItemColorModelError.getForecastDataError(),
        error as Error,
      ),
    );
  }
};
