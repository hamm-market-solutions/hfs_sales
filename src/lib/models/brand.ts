"use server";

import { Err, Ok } from "ts-results";
import { asc } from "drizzle-orm";

import BrandModelError from "../errors/BrandModelError";

import { db } from "@/db";
import { brand } from "@/db/schema";
import { throwToHfsError } from "../errors/HfsError";

export const getAllBrands = async () => {
    try {
        return Ok(await db.select().from(brand).orderBy(asc(brand.name)));
    } catch (error) {
        return Err(
            throwToHfsError(500, BrandModelError.getError(), error as Error),
        );
    }
};
