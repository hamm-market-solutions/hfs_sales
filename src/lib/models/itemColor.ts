import { and, count, eq, sql } from "drizzle-orm";
import _ from "lodash";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import ItemColorModelError from "../errors/ItemColorModelError";

import { ForecastTableRequest } from "@/types/table";
import { db } from "@/db";
import { brand, sItem, sItemColor, sSeason, } from "@/db/schema";
import { sortingStateToDrizzle } from "@/utils/conversions";
import { TABLE_FETCH_SIZE } from "../tables/constants";
import { Err, Ok, Some } from "@/utils/fp-ts";

export const getForecastTableCount = async ({
    brand,
    season_code,
}: {
  brand: number;
  season_code: number;
}): Promise<HfsResult<number>> => {
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
            throwToHfsError(
                500,
                ItemColorModelError.getForecastDataCountError(),
                Some(error as Error),
            ),
        );
    }
};

/**
 *
 * @param param0
 * @returns [ForecastTableColumns]
 */
export const getForecastTableData = async ({
    page,
    sorting,
    country,
    brand: brandNo,
    season_code,
    search: _search,
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
            rrp: sql<number>`(
        SELECT
          rep_retail_price
        FROM s_variant
        LEFT JOIN s_assortment ON s_variant.size_code = s_assortment.code
        WHERE s_variant.item_no = ${sItemColor.itemNo}
          AND s_variant.color_code = ${sItemColor.colorCode}
          AND s_assortment.code IS NULL
          AND s_variant.size_code NOT LIKE 'L%'
          AND s_variant.size_code NOT LIKE 'R%'
        LIMIT 1
      )`.mapWith(
        Number,
    ),
            wsp: sql<number>`(
        SELECT
          unit_sale_price
        FROM s_variant
        LEFT JOIN s_assortment ON s_variant.size_code = s_assortment.code
        WHERE s_variant.item_no = ${sItemColor.itemNo}
          AND s_variant.color_code = ${sItemColor.colorCode}
          AND s_assortment.code IS NULL
          AND s_variant.size_code NOT LIKE 'L%'
          AND s_variant.size_code NOT LIKE 'R%'
        LIMIT 1
      )`.mapWith(
        Number,
    ),
            forecastAmount:
        sql<number>`(SELECT amount FROM forecast WHERE item_no = ${sItemColor.itemNo} AND color_code = ${sItemColor.colorCode} AND country_code = ${country} ORDER BY timestamp DESC LIMIT 1)`.mapWith(
        	Number,
        ),
        };
        const orderBySelectClone = _.cloneDeep(select);
        const orderBy = sortingStateToDrizzle(orderBySelectClone, sorting);
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
                ),
            )
            .groupBy(sItemColor.itemNo, sItemColor.colorCode)
            .orderBy(...orderBy)
            .limit(TABLE_FETCH_SIZE)
            .offset((page - 1) * TABLE_FETCH_SIZE);

        return Ok(
            data
        );
    } catch (error) {
        console.log("error", error);

        return Err(
            throwToHfsError(
                500,
                ItemColorModelError.getForecastDataError(),
                Some(error as Error),
            ),
        );
    }
};
