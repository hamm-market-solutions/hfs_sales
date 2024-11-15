import { Err, Ok } from "ts-results";
import { and, asc, count, desc, eq } from "drizzle-orm";
import _ from "lodash";

import HfsError from "../errors/HfsError";
import ItemColorModelError from "../errors/ItemColorModelError";

import { ForecastTableRequest } from "@/types/table";
import { db } from "@/db";
import { forecast, sItem, sItemColor } from "@/db/schema";
import { sortingStateToDrizzle } from "@/utils/conversions";

export const getForecastTableCount = async ({
  brand,
  season_code,
}: {
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

export const getForecastTableData = async ({
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
      forecastAmount: forecast.amount,
    };
    const selectClone = _.cloneDeep(select);
    const orderBy = sortingStateToDrizzle(selectClone, sorting);
    const forecastSq = db.select().from(forecast).orderBy(desc(forecast.timestamp)).groupBy(forecast.itemNo, forecast.colorCode).as("forecast");

    return Ok(
      await db
        .select(select)
        .from(sItemColor)
        .leftJoin(sItem, and(eq(sItemColor.itemNo, sItem.no)))
        .leftJoin(forecastSq, and(eq(sItemColor.itemNo, forecastSq.itemNo), eq(sItemColor.colorCode, forecastSq.colorCode), eq(forecastSq.countryCode, country)))
        .where(
          and(
            eq(sItem.brandNo, brand.toString()),
            eq(sItem.seasonCode, season_code),
          ),
        )
        .groupBy(sItemColor.itemNo, sItemColor.colorCode)
        .orderBy(...orderBy)
        .limit(size)
        .offset(start),
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
