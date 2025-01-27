import { and, desc, eq, inArray, isNull, like, not, SQL, sql, sum } from "drizzle-orm";
import { fromNullable, Option } from "fp-ts/Option";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import ForecastModelError from "../errors/ForecastModelError";
import { getAccessTokenPayload } from "../auth/jwt";

import { db } from "@/db";
import { forecast, sAssortment, sColor, sVariant } from "@/db/schema";
import { getAllSeasons } from "./season";
import { isErr, None, unwrap, unwrapOr } from "@/utils/fp-ts";

import _ from "lodash";

import ItemColorModelError from "../errors/ItemColorModelError";

import { ForecastTableColumns, ForecastTableRequest } from "@/types/table";
import { brand, sItem, sItemColor, sSeason, } from "@/db/schema";
import { tableFiltersToDrizzle, tableSortingToDrizzle } from "@/utils/conversions";
import { TABLE_FETCH_SIZE } from "../tables/constants";
import { Err, Ok, Some } from "@/utils/fp-ts";
import { getCurrentUser } from "./user";

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
    filters,
}: ForecastTableRequest): Promise<HfsResult<[{
    brandNo: string | null,
    brandName: string | null,
    seasonCode: number | null,
    seasonName: string | null,
    description: string | null,
    preCollection: number,
    mainCollection: number,
    lateCollection: number,
    specialCollection: number,
    last: string | null,
    itemNo: string ,
    colorCode: string,
    colorName: string | null,
    rrp: number | null,
    wsp: number | null,
    forecastAmount: number,
    totalRowCount: number,
}[], Partial<Record<keyof ForecastTableColumns, { description: string, value: number }>>]>> => {
    try {
        const user = await getCurrentUser();
        if (isErr(user)) {
            return user;
        }
        const currentUser = unwrap(user);
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
            colorName: sColor.name,
            rrp: sVariant.repRetailPrice,
            wsp: sVariant.unitSalePrice,
            forecastAmount: sql<number>`(SELECT amount FROM forecast WHERE item_no = ${sItemColor.itemNo} AND color_code = ${sItemColor.colorCode} AND country_code = ${country} AND created_by = ${currentUser.id} ORDER BY timestamp DESC LIMIT 1)`.mapWith(
                Number,
            ),
            totalRowCount: sql<number>`COUNT(*) OVER()`,
        };
        const orderBySelectClone = _.cloneDeep(select);
        const whereSelectClone = _.cloneDeep(select);
        const orderBy = tableSortingToDrizzle(orderBySelectClone, sorting);
        const filtersWhere = tableFiltersToDrizzle(whereSelectClone, filters);
        const data = await db
            .select(select)
            .from(sItemColor)
            .leftJoin(sItem, and(eq(sItemColor.itemNo, sItem.no)))
            .leftJoin(brand, eq(sItem.brandNo, brand.no))
            .leftJoin(sSeason, eq(sItem.seasonCode, sSeason.code))
            .leftJoin(sColor, and(eq(sItemColor.colorCode, sColor.code), eq(sItem.seasonCode, sColor.seasonCode)))
            .leftJoin(sAssortment, eq(sItemColor.colorCode, sAssortment.code))
            .leftJoin(sVariant, and(eq(sItemColor.itemNo, sVariant.itemNo), eq(sItemColor.colorCode, sVariant.colorCode), isNull(sAssortment.code), not(like(sVariant.sizeCode, "L%")), not(like(sVariant.sizeCode, "R%"))))
            .where(
                and(
                    eq(sItem.brandNo, brandNo.toString()),
                    eq(sItem.seasonCode, season_code),
                    ...filtersWhere,
                ),
            )
            .groupBy(sItemColor.itemNo, sItemColor.colorCode)
            .orderBy(...orderBy)
            .limit(TABLE_FETCH_SIZE)
            .offset((page - 1) * TABLE_FETCH_SIZE);
        const aggregations = await calculateForecastTableAggregations(filtersWhere, brandNo.toString(), season_code, country, currentUser.id);

        return Ok([data, aggregations]);
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

const calculateForecastTableAggregations = async (filtersWhere: SQL<unknown>[], brandNo: string, seasonCode: number, country: string, userId: number): Promise<Partial<Record<keyof ForecastTableColumns, { description: string, value: number }>>> => {
    try {
        const data = await db
            .select({
                forecast_amount: sql<number>`(SELECT amount FROM forecast WHERE item_no = ${sItemColor.itemNo} AND color_code = ${sItemColor.colorCode} AND country_code = ${country} AND created_by = ${userId} ORDER BY timestamp DESC LIMIT 1)`.mapWith(
                    Number,
                ),
            })
            .from(sItemColor)
            .leftJoin(sItem, and(eq(sItemColor.itemNo, sItem.no)))
            .leftJoin(brand, eq(sItem.brandNo, brand.no))
            .leftJoin(sSeason, eq(sItem.seasonCode, sSeason.code))
            .leftJoin(sColor, and(eq(sItemColor.colorCode, sColor.code), eq(sItem.seasonCode, sColor.seasonCode)))
            .leftJoin(sAssortment, eq(sItemColor.colorCode, sAssortment.code))
            .leftJoin(sVariant, and(eq(sItemColor.itemNo, sVariant.itemNo), eq(sItemColor.colorCode, sVariant.colorCode), isNull(sAssortment.code), not(like(sVariant.sizeCode, "L%")), not(like(sVariant.sizeCode, "R%"))))
            .where(
                and(
                    eq(sItem.brandNo, brandNo.toString()),
                    eq(sItem.seasonCode, seasonCode),
                    ...filtersWhere,
                ),
            )
            .groupBy(sItemColor.itemNo, sItemColor.colorCode);

        return {
            forecast_amount: {
                description: "Total Forecast Amount",
                value: Number(data.map((d) => d.forecast_amount).reduce((acc, curr) => acc + curr, 0)),
            },
        };
    } catch (_error) {
        return {};
    }
}

export const createForecast = async (
    seasonCode: number,
    itemNo: number,
    colorCode: string,
    countryCode: string,
    amount: number,
): Promise<HfsResult<typeof forecast.$inferInsert>> => {
    try {
        const res: HfsResult<Option<typeof forecast.$inferSelect>> = await getLatestForecast(itemNo, colorCode);
        const latestForecastOpt: Option<typeof forecast.$inferSelect> = unwrapOr(res, None);
        const latestForecast: typeof forecast.$inferSelect = unwrap(latestForecastOpt); // TODO: Handle unwrap

        if (latestForecast && latestForecast.amount === amount) {
            return Ok(latestForecast);
        }
        const user = await getAccessTokenPayload();

        if (isErr(user)) {
            return user;
        }
        const userId = user.left.sub!;
        const result = await db.insert(forecast).values({
            seasonCode: seasonCode,
            itemNo: itemNo.toString(),
            colorCode: colorCode,
            amount: amount,
            countryCode: countryCode.toUpperCase(),
            createdBy: Number(userId),
        }) as any as typeof forecast.$inferInsert;

        return Ok(result);
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ForecastModelError.saveForecastError(),
                Some(error as Error),
            ),
        );
    }
};

export async function getLatestForecast(
    itemNo: number,
    colorCode: string,
): Promise<HfsResult<Option<typeof forecast.$inferSelect>>> {
    try {
        const latestForecast = await db
            .select()
            .from(forecast)
            .where(
                and(
                    eq(forecast.itemNo, itemNo.toString()),
                    eq(forecast.colorCode, colorCode),
                ),
            )
            .orderBy(desc(forecast.timestamp))
            .limit(1);

        if (latestForecast) {
            return Ok(Some(latestForecast[0]));
        } else {
            return Ok(None);
        }
    } catch (error) {
        console.error(error);

        return Err(
            throwToHfsError(
                500,
                ForecastModelError.getError("latest forecast"),
                Some(error as Error),
            ),
        );
    }
}

export async function getSumForecastForSeason(seasonCode: number) {
    try {
        const forecasts = await db
            .select({ sumQty: sum(forecast.amount) })
            .from(forecast)
            .where(eq(forecast.seasonCode, seasonCode));

        return Ok(forecasts[0]);
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ForecastModelError.getError("all forecasts"),
                Some(error as Error),
            ),
        );
    }
}

export async function getSumForecastForLastFiveSeasons() {
    try {
        const seasons = unwrapOr((await getAllSeasons()), []);
        const lastFiveSeasons = seasons.slice(0, 5);
        const seasonCodes = lastFiveSeasons.map((season) => season.code);
        const forecastSums = seasonCodes.map(async (seasonCode) => {
            const qty = unwrap((await getSumForecastForSeason(seasonCode)));

            return { seasonCode: seasonCode, sumQty: Number(qty.sumQty) };
        });
        const forecasts = await Promise.all(forecastSums);

        return Ok(forecasts);
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ForecastModelError.getError("all forecasts"),
                Some(error as Error),
            ),
        );
    }
}

export async function exportLatestForecasts() {
    try {
        const forecasts = await db
            .select()
            .from(forecast)
            .orderBy(desc(forecast.timestamp))
            .where(isNull(forecast.exportedOn));

        await db.update(forecast).set({
            exportedOn: sql`NOW()`,
        }).where(inArray(forecast.id, forecasts.map((f) => f.id)));

        return Ok(forecasts);
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ForecastModelError.getError("latest forecasts for export"),
                Some(error as Error),
            ),
        );
    }
}

export const getLastForecasts = async (
    userId: number,
    seasonCode: number,
): Promise<HfsResult<{
    last: Option<string>,
    amount: number,
}[]>> => {
    try {
        const data = await db
            .selectDistinct({
                last: sItem.last,
                amount: sum(forecast.amount),
            })
            .from(forecast)
            .leftJoin(sItem, eq(forecast.itemNo, sItem.no))
            .where(and(
                eq(forecast.createdBy, userId),
                eq(forecast.seasonCode, seasonCode),
            ))
            .orderBy(desc(forecast.timestamp));
        console.log("data", data);

        const forecasts = data.map((f) => ({
            last: fromNullable(f.last),
            amount: Number(f.amount),
        }));

        return Ok(forecasts);

    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ForecastModelError.getError("forecasts grouped by lasts"),
                Some(error as Error),
            ),
        );
    }
}
