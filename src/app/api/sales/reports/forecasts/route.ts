import { NextRequest, NextResponse } from "next/server";

import { forecast } from "@/db/schema";
import { createForecast } from "@/lib/models/forecast";
import { resultToResponse } from "@/utils/conversions";
import { validateUserAuthorized } from "@/lib/auth/validations";
import { HfsResult } from "@/lib/errors/HfsError";
import { assertSeasonActive } from "@/lib/models/seasonBrandPhase";
import { Err, isErr, None, Some } from "@/utils/fp-ts";

export const POST = async (
    request: NextRequest,
): Promise<NextResponse<HfsResult<typeof forecast.$inferInsert>>> => {
    const userValidRes = await validateUserAuthorized(None, Some([
        "forecast.add",
    ]));

    if (isErr(userValidRes)) {
        return resultToResponse(Err(userValidRes.right));
    }
    const { itemNo, colorCode, countryCode, seasonCode, amount } = await request.json();
    const seasonActiveRes = await assertSeasonActive(Number(seasonCode));

    if (isErr(seasonActiveRes)) {
        return resultToResponse(seasonActiveRes);
    }

    const result = await createForecast(
        seasonCode,
        itemNo,
        colorCode,
        countryCode,
        amount,
    );

    return resultToResponse(result);
};
