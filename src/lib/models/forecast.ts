import { Err, None, Ok, Option, Some } from "ts-results";
import { and, desc, eq, inArray, isNull, sql, sum } from "drizzle-orm";

import HfsError, { HfsResult } from "../errors/HfsError";
import ForecastModelError from "../errors/ForecastModelError";
import { getAccessTokenPayload } from "../auth/jwt";

import { db } from "@/db";
import { forecast } from "@/db/schema";
import { getAllSeasons } from "./season";

export const createForecast = async (
    seasonCode: number,
    itemNo: number,
    colorCode: string,
    countryCode: string,
    amount: number,
): Promise<HfsResult<typeof forecast.$inferInsert>> => {
    try {
        const latestForecast = (await getLatestForecast(itemNo, colorCode))
            .unwrapOr(null)
            ?.unwrapOr(null);

        if (latestForecast && latestForecast.amount === amount) {
            return Ok(latestForecast);
        }
        const user = await getAccessTokenPayload();

        if (user.err) {
            return user;
        }
        const userId = user.val.sub!;
        const result = await db.insert(forecast).values({
            seasonCode: seasonCode,
            itemNo: itemNo.toString(),
            colorCode: colorCode,
            amount: amount,
            countryCode: countryCode.toUpperCase(),
            createdBy: Number(userId),
        });

        return Ok(result);
    } catch (error) {
        return Err(
            HfsError.fromThrow(
                500,
                ForecastModelError.saveForecastError(),
        error as Error,
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
            HfsError.fromThrow(
                500,
                ForecastModelError.getError("latest forecast"),
        error as Error,
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
            HfsError.fromThrow(
                500,
                ForecastModelError.getError("all forecasts"),
        error as Error,
            ),
        );
    }
}

export async function getSumForecastForLastFiveSeasons() {
    try {
        const seasons = (await getAllSeasons()).unwrapOr([]);
        const lastFiveSeasons = seasons.slice(0, 5);
        const seasonCodes = lastFiveSeasons.map((season) => season.code);
        const forecastSums = seasonCodes.map(async (seasonCode) => {
            const qty = (await getSumForecastForSeason(seasonCode)).unwrap();

            return { seasonCode: seasonCode, sumQty: Number(qty.sumQty) };
        });
        const forecasts = await Promise.all(forecastSums);

        return Ok(forecasts);
    } catch (error) {
        return Err(
            HfsError.fromThrow(
                500,
                ForecastModelError.getError("all forecasts"),
        error as Error,
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
            HfsError.fromThrow(
                500,
                ForecastModelError.getError("latest forecasts for export"),
        error as Error,
            ),
        );
    }
}
