import { Err, None, Ok, Option, Some } from "ts-results";
import { and, desc, eq } from "drizzle-orm";

import HfsError, { HfsResult } from "../errors/HfsError";
import ForecastModelError from "../errors/ForecastModelError";
import { getAccessTokenPayload } from "../auth/jwt";

import { db } from "@/db";
import { forecast } from "@/db/schema";

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

    return Ok(result as any as typeof forecast.$inferInsert);
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

// export async function getAllForecastsForSeason(seasonCode: number) {
//   try {
//     const forecasts = await db
//       .select()
//       .from(forecast)
//       .where(eq(forecast.seasonCode, seasonCode.toString()));

//     return Ok(forecasts);
//   } catch (error) {
//     return Err(
//       HfsError.fromThrow(
//         500,
//         ForecastModelError.getError("all forecasts"),
//         error as Error,
//       ),
//     );
//   }
// }
