"use server";

import { Option } from "fp-ts/Option";
import { desc } from "drizzle-orm";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import SeasonModelError from "../errors/SeasonModelError";

import { db } from "@/src/db";
import { sSeason } from "@/src/db/schema";
import { Err, None, Ok, Some } from "@/src/utils/fp-ts";

export const getAllSeasons = async (): Promise<
  HfsResult<{ code: number; name: Option<string> }[]>
> => {
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
