"use server";

import { Err, Ok } from "ts-results";
import { asc } from "drizzle-orm";

import HfsError from "../errors/HfsError";
import BrandModelError from "../errors/BrandModelError";

import { db } from "@/db";
import { brand } from "@/db/schema";

export const getAllBrands = async () => {
  try {
    return Ok(await db.select().from(brand).orderBy(asc(brand.name)));
  } catch (error) {
    return Err(
      HfsError.fromThrow(500, BrandModelError.getError(), error as Error),
    );
  }
};
