"use server";

import { Err, Ok } from "ts-results";
import { desc } from "drizzle-orm";

import HfsError from "../errors/HfsError";
import SeasonModelError from "../errors/SeasonModelError";

import { db } from "@/db";
import { sSeason } from "@/db/schema";

export const getAllSeasons = async () => {
    try {
        return Ok(
            await db
                .select({ code: sSeason.code, name: sSeason.name })
                .from(sSeason)
                .orderBy(desc(sSeason.code)),
        );
    } catch (error) {
        return Err(
            HfsError.fromThrow(500, SeasonModelError.getError(), error as Error),
        );
    }
};
