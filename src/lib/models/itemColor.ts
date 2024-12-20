import { Err, Ok } from "ts-results";
import { and, count, eq, like, sql } from "drizzle-orm";
import _ from "lodash";

import HfsError from "../errors/HfsError";
import ItemColorModelError from "../errors/ItemColorModelError";

import { ForecastTableRequest } from "@/types/table";
import { db } from "@/db";
import { brand, sItem, sItemColor, sSeason, } from "@/db/schema";
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
  brand: brandNo,
  season_code,
  search,
}: ForecastTableRequest) => {
  try {
    const select = {
      brandNo: sItem.brandNo,
      brandName: brand.name,
      seasonCode: sItem.seasonCode,
      seasonName: sSeason.name,
      description: sItem.description,
      preCollection: sItemColor.preCollection,
      mainCollection: sItemColor.mainCollection,
      lateCollection: sItemColor.lateCollection,
      specialCollection: sItemColor.specialCollection,
      last: sItem.last,
      itemNo: sItemColor.itemNo,
      colorCode: sItemColor.colorCode,
      salePrice: sql<number>`(SELECT unit_sale_price FROM s_variant WHERE item_no = ${sItemColor.itemNo} AND color_code = ${sItemColor.colorCode} LIMIT 1)`.mapWith(
        Number,
      ),
      forecastAmount:
        sql<number>`(SELECT amount FROM forecast WHERE item_no = ${sItemColor.itemNo} AND color_code = ${sItemColor.colorCode} AND country_code = ${country} ORDER BY timestamp DESC LIMIT 1)`.mapWith(
          Number,
        ),
    };
    const selectClone = _.cloneDeep(select);
    const orderBy = sortingStateToDrizzle(selectClone, sorting);
    console.log("search:", search);
    const data =await db
      .select(select)
      .from(sItemColor)
      .leftJoin(sItem, and(eq(sItemColor.itemNo, sItem.no)))
      .leftJoin(brand, eq(sItem.brandNo, brand.no))
      .leftJoin(sSeason, eq(sItem.seasonCode, sSeason.code))
      .where(
        and(
          eq(sItem.brandNo, brandNo.toString()),
          eq(sItem.seasonCode, season_code),
          like(sItem.description, `%${search}%`),
        ),
      )
      .groupBy(sItemColor.itemNo, sItemColor.colorCode)
      .orderBy(...orderBy)
      .limit(size)
      .offset(start);

    console.log("data:", data);

    return Ok(
      data
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
