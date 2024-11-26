import { Err, Ok } from "ts-results";
import { eq, max, min } from "drizzle-orm";

import HfsError from "../errors/HfsError";
import ModelError from "../errors/ModelError";

import { db } from "@/db";
import { sSeasonBrandPhase } from "@/db/schema";
import SeasonBrandPhaseError from "../errors/SeasonbrandPhaseError";

export const getSeasonTime = async (seasonCode: number) => {
  try {
    return Ok(
      (await db
        .select({ code: sSeasonBrandPhase.seasonCode, start: min(sSeasonBrandPhase.startDate), end: max(sSeasonBrandPhase.endDate) })
        .from(sSeasonBrandPhase)
        .where(eq(sSeasonBrandPhase.seasonCode, seasonCode)))[0],
    );
  } catch (error) {
    return Err(
      HfsError.fromThrow(
        500,
        ModelError.notFound("season_brand_phase"),
        error as Error,
      ),
    );
  }
};

export const isSeasonActive = async (seasonCode: number) => {
    try {
        const now = new Date();
        const seasonTime = await getSeasonTime(seasonCode);

        if (seasonTime.err) {
            return seasonTime;
        }
        const seasonStart = new Date(seasonTime.val.start ?? "2100-01-01");
        const seasonEnd = new Date(seasonTime.val.end ?? "2000-01-01");

        return Ok(seasonStart <= now && now <= seasonEnd);
    } catch (error) {
        return Err(
            HfsError.fromThrow(
                500,
                ModelError.notFound("season_brand_phase"),
                error as Error,
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
            HfsError.fromThrow(
                400,
                SeasonBrandPhaseError.seasonInactive(seasonCode),
            ),
        );
    }
    return Ok(true);
}
