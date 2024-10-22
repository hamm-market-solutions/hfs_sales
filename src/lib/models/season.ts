"use server";

import { Err, Ok } from "ts-results";

import prisma from "../prisma";
import HfsError from "../errors/HfsError";
import SeasonModelError from "../errors/SeasonModelError";

export const getAllSeasons = async () => {
  try {
    return Ok(
      await prisma.s_season.findMany({
        orderBy: {
          code: "desc",
        },
        select: {
          code: true,
          name: true,
        },
      }),
    );
  } catch (error) {
    return Err(
      HfsError.fromThrow(500, SeasonModelError.getError(), error as Error),
    );
  }
};
