import { NextRequest, NextResponse } from "next/server";
import { Err, Ok } from "ts-results";

import { forecast } from "@/db/schema";
import { createForecast } from "@/lib/models/forecast";
import { resultToResponse } from "@/utils/conversions";
import { validateUserAuthorized } from "@/lib/auth/validations";
import { HfsResult } from "@/lib/errors/HfsError";
import { assertSeasonActive } from "@/lib/models/seasonBrandPhase";

export const POST = async (
    request: NextRequest,
): Promise<NextResponse<HfsResult<typeof forecast.$inferInsert>>> => {
    const userValidRes = await validateUserAuthorized(undefined, [
        "forecast.add",
    ]);

    if (userValidRes.err) {
        return resultToResponse(Err(userValidRes.val));
    }
    const { itemNo, colorCode, countryCode, seasonCode, amount } =
    await request.json();
    const seasonActiveRes = await assertSeasonActive(Number(seasonCode));

    if (seasonActiveRes.err) {
        return resultToResponse(Err(seasonActiveRes.val));
    }

    const result = await createForecast(
        seasonCode,
        itemNo,
        colorCode,
        countryCode,
        amount,
    );

    return resultToResponse(Ok(result.val));
};
