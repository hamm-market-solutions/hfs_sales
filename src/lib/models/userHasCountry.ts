"use server";

import { eq } from "drizzle-orm";

import UserHasCountryModelError from "../errors/UserHasCountryModelError";

import { db } from "@/src/db";
import {
  sCountry,
  userHasCountry as userHasCountryTable,
} from "@/src/db/schema";
import { Err, isErr, Ok, Some } from "@/src/utils/fp-ts";

export const userHasCountry = async (userId: number, countryCode: string) => {
  const userCountries = await getUserCountries(userId);

  if (isErr(userCountries)) {
    return userCountries;
  }
  const countryCodes = userCountries.left.map((userCountry) =>
    userCountry.s_country?.code.toUpperCase()
  );

  if (!countryCodes.includes(countryCode.toUpperCase())) {
    return Err({
      status: 403,
      message: UserHasCountryModelError.hasCountryError(countryCode),
    });
  }

  return Ok(true);
};

export const getUserCountries = async (userId: number) => {
  try {
    const data = await db
      .select()
      .from(userHasCountryTable)
      .leftJoin(sCountry, eq(userHasCountryTable.countryCode, sCountry.code))
      .where(eq(userHasCountryTable.userId, userId));
    return Ok(
      data,
    );
  } catch (error) {
    return Err({
      status: 500,
      message: UserHasCountryModelError.getError(),
      cause: Some(error as Error),
    });
  }
};
