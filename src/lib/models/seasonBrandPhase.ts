import { Err, None, Ok, Option, Some } from "ts-results";
import { eq, max, min } from "drizzle-orm";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import ModelError from "../errors/ModelError";
import SeasonBrandPhaseError from "../errors/SeasonbrandPhaseError";

import { db } from "@/db";
import { sSeasonBrandPhase } from "@/db/schema";

export const getSeasonTime = async (seasonCode: number): Promise<HfsResult<{
    code: number;
    start: Option<string>;
    end: Option<string>;
}>> => {
    try {
        const data = await db
            .select({
                code: sSeasonBrandPhase.seasonCode,
                start: min(sSeasonBrandPhase.startDate),
                end: max(sSeasonBrandPhase.endDate),
            })
            .from(sSeasonBrandPhase)
            .where(eq(sSeasonBrandPhase.seasonCode, seasonCode));
        const seasonTime = data[0];



        return Ok(
            {
                code: seasonTime.code,
                start: seasonTime.start ? Some(seasonTime.start) : None,
                end: seasonTime.end ? Some(seasonTime.end) : None,
            }
        );
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ModelError.notFound("season_brand_phase"),
                Some(error as Error),
            ),
        );
    }
};

export const isSeasonActive = async (seasonCode: number): Promise<HfsResult<boolean>> => {
    try {
        const now = new Date();
        const seasonTime = await getSeasonTime(seasonCode);

        if (seasonTime.err) {
            return seasonTime;
        }
        const seasonStart = new Date(seasonTime.val.start.unwrapOr("2100-01-01"));
        const seasonEnd = new Date(seasonTime.val.end.unwrapOr("2000-01-01"));

        return Ok(seasonStart <= now && now <= seasonEnd);
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ModelError.notFound("season_brand_phase"),
                Some(error as Error),
            ),
        );
    }
};

export const assertSeasonActive = async (seasonCode: number) => {
    const seasonActive = await isSeasonActive(seasonCode);

    if (seasonActive.err) {
        return seasonActive;
    }
    if (!seasonActive.val) {
        return Err(
            throwToHfsError(400, SeasonBrandPhaseError.seasonInactive(seasonCode)),
        );
    }

    return Ok(true);
};
