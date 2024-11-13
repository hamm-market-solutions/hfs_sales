"use server";

import { Err, Ok } from "ts-results";
import { eq } from "drizzle-orm";

import HfsError from "../errors/HfsError";
import UserHasCountryModelError from "../errors/UserHasCountryModelError";

import { db } from "@/db";
import { sCountry, userHasCountry as userHasCountryTable } from "@/db/schema";

export const userHasCountry = async (userId: number, countryCode: string) => {
  const userCountries = await getUserCountries(userId);

  if (userCountries.err) {
    return userCountries;
  }
  const countryCodes = userCountries.val.map((userCountry) =>
    userCountry.s_country?.code.toUpperCase(),
  );

  if (!countryCodes.includes(countryCode.toUpperCase())) {
    return Err(
      new HfsError(403, UserHasCountryModelError.hasCountryError(countryCode)),
    );
  }

  return Ok(true);
};

export const getUserCountries = async (userId: number) => {
  try {
    return Ok(
      //   await prisma.user_has_country.findMany({
      //     include: {
      //       s_country: true,
      //     },
      //     where: {
      //       user_id: userId,
      //     },
      //   }),
      await db
        .select()
        .from(userHasCountryTable)
        .leftJoin(sCountry, eq(userHasCountryTable.countryCode, sCountry.code))
        .where(eq(userHasCountryTable.userId, userId)),
    );
  } catch (error) {
    return Err(
      HfsError.fromThrow(
        500,
        UserHasCountryModelError.getError(),
        error as Error,
      ),
    );
  }
};
