import { Err, Ok } from "ts-results";
import { and, count, eq } from "drizzle-orm";

import HfsError from "../errors/HfsError";
import ItemColorModelError from "../errors/ItemColorModelError";

import { ForecastTableRequest } from "@/types/table";
import { db } from "@/db";
import { sItem, sItemColor } from "@/db/schema";
import { deepCopy } from "@/utils/objects";
import { sortingStateToDrizzle } from "@/utils/conversions";

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
    const dataCount = await db
      .select({ count: count() })
      .from(sItemColor)
      .leftJoin(sItem, and(eq(sItemColor.itemNo, sItem.no)))
      .where(
        and(
          eq(sItem.brandNo, brand.toString()),
          eq(sItem.seasonCode, season_code),
        ),
      );

    return Ok(dataCount[0].count);
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
      brandNo: sItem.brandNo,
      seasonCode: sItem.seasonCode,
      description: sItem.description,
      minQtyStyle: sItem.minQtyStyle,
      preCollection: sItemColor.preCollection,
      mainCollection: sItemColor.mainCollection,
      lateCollection: sItemColor.lateCollection,
      specialCollection: sItemColor.specialCollection,
      itemNo: sItemColor.itemNo,
      colorCode: sItemColor.colorCode,
      purchasePrice: sItemColor.purchasePrice,
    };
    // const selectClone = deepCopy(select);
    // const orderBy = sortingStateToDrizzle(selectClone, sorting);
    // const userId = (await getAccessTokenPayload()).unwrap().sub!;

    return Ok(
      //   await prisma.s_item_color.findMany({
      //     select: select,
      //     where: {
      //       s_item: {
      //         brand_no: brand.toString(),
      //         season_code: season_code,
      //       },
      //     },
      //     orderBy: orderBy,
      //     skip: start,
      //     take: size,
      //   }),
      await db
        .select(select)
        .from(sItemColor)
        .leftJoin(sItem, and(eq(sItemColor.itemNo, sItem.no)))
        .where(
          and(
            eq(sItem.brandNo, brand.toString()),
            eq(sItem.seasonCode, season_code),
          ),
        )
        // .orderBy(orderBy)
        .limit(size)
        .offset(start),
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
