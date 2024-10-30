import { Err, Ok } from "ts-results";
import { forecast } from "@prisma/client";

import prisma from "../prisma";
import HfsError, { HfsResult } from "../errors/HfsError";
import ForecastModelError from "../errors/ForecastModelError";

export const createForecast = async (
  itemNo: number,
  colorCode: string,
  amount: number,
) => {
  try {
    const latestForecast = (
      await getLatestForecast(itemNo, colorCode)
    ).unwrapOr(null);

    if (latestForecast && latestForecast.amount === amount) {
      return Ok(latestForecast);
    }

    return Ok(
      await prisma.forecast.create({
        data: {
          item_no: itemNo.toString(),
          color_code: colorCode,
          amount: amount,
        },
      }),
    );
  } catch (error) {
    console.error(error);

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
): Promise<HfsResult<forecast | null>> {
  try {
    return Ok(
      await prisma.forecast.findFirst({
        where: {
          item_no: itemNo.toString(),
          color_code: colorCode,
        },
        orderBy: {
          timestamp: "desc",
        },
      }),
    );
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
