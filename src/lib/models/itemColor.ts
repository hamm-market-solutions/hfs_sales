import { Err, Ok } from "ts-results";

import HfsError from "../errors/HfsError";
import prisma from "../prisma";
import ItemColorModelError from "../errors/ItemColorModelError";

import { ForecastTableRequest } from "@/types/table";
import { sortingStateToPrisma } from "@/utils/conversions";
import { deepCopy } from "@/utils/objects";

export const getForecastItemColorDataCount = async ({
  country,
  brand,
  season_code,
}: {
  country: string;
  brand: number;
  season_code: number;
}) => {
  try {
    return Ok(
      await prisma.s_item_color.count({
        where: {
          s_item: {
            brand_no: brand.toString(),
            season_code: season_code,
          },
        },
      }),
    );
  } catch (error) {
    return Err(
      HfsError.fromThrow(
        500,
        ItemColorModelError.getForecastDataCountError(),
        error as Error,
      ),
    );
  }
};

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
    const orderBy = sortingStateToPrisma(selectClone, sorting);

    return Ok(
      await prisma.s_item_color.findMany({
        select: select,
        where: {
          s_item: {
            brand_no: brand.toString(),
            season_code: season_code,
          },
        },
        orderBy: orderBy,
        skip: start,
        take: size,
      }),
    );
  } catch (error) {
    console.log(error);

    return Err(
      HfsError.fromThrow(
        500,
        ItemColorModelError.getForecastDataError(),
        error as Error,
      ),
    );
  }
};
