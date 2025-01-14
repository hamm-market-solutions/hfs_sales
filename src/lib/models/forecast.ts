import { and, desc, eq, inArray, isNull, sql, sum } from "drizzle-orm";
import { Option } from "fp-ts/Option";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import ForecastModelError from "../errors/ForecastModelError";
import { getAccessTokenPayload } from "../auth/jwt";

import { db } from "@/db";
import { forecast } from "@/db/schema";
import { getAllSeasons } from "./season";
import { Err, isErr, None, Ok, Some, unwrap, unwrapOr } from "@/utils/fp-ts";

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
