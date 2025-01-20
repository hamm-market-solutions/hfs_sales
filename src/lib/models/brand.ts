"use server";

import { asc } from "drizzle-orm";

import BrandModelError from "../errors/BrandModelError";

import { db } from "@/db";
import { brand } from "@/db/schema";
import { throwToHfsError } from "../errors/HfsError";
import { Err, Ok, Some } from "@/utils/fp-ts";

export const getAllBrands = async () => {
  try {
    return Ok(await db.select().from(brand).orderBy(asc(brand.name)));
  } catch (error) {
    return Err(
      throwToHfsError(500, BrandModelError.getError(), Some(error as Error)),
    );
  }
};
