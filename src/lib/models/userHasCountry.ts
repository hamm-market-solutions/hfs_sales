"use server";

import { Err, Ok } from "ts-results";

import HfsError from "../errors/HfsError";
import prisma from "../prisma";
import UserHasCountryModelError from "../errors/UserHasCountryModelError";

export const userHasCountry = async (userId: number, countryCode: string) => {
  const userCountries = await getUserCountries(userId);

  if (userCountries.err) {
    return userCountries;
  }
  const countryCodes = userCountries.val.map(
    (userCountry) => userCountry.s_country.code.toUpperCase(),
  );

  if (!countryCodes.includes(countryCode.toUpperCase())) {
    return Err(
      new HfsError(403,  UserHasCountryModelError.hasCountryError(countryCode)),
    );
  }

  return Ok(true);
};

export const getUserCountries = async (userId: number) => {
  try {
    return Ok(
      await prisma.user_has_country.findMany({
        include: {
          s_country: true,
        },
        where: {
          user_id: userId,
        },
      }),
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
