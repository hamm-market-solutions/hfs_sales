"use server";

import { Err, None, Ok, Option, Some } from "ts-results";
import { desc } from "drizzle-orm";

import  { HfsResult, throwToHfsError } from "../errors/HfsError";
import SeasonModelError from "../errors/SeasonModelError";

import { db } from "@/db";
import { sSeason } from "@/db/schema";

export const getAllSeasons = async (): Promise<HfsResult<{ code: number; name: Option<string> }[]>> => {
    try {
        const data = await db
            .select({ code: sSeason.code, name: sSeason.name })
            .from(sSeason)
            .orderBy(desc(sSeason.code));

        return Ok(data.map((entry) => ({
            code: entry.code,
            name: entry.name ? Some(entry.name) : None,
        })));
    } catch (error) {
        return Err(
            throwToHfsError(500, SeasonModelError.getError(), Some(error as Error)),
        );
    }
};
