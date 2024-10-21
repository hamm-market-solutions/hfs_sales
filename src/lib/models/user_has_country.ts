import { Err, Ok } from "ts-results";

import HfsError from "../errors/HfsError";
import prisma from "../prisma";
import UserHasCountryModelError from "../errors/UserHasCountryModelError";

export const getUserCountries = async (userId: number) => {
  try {
    return Ok(
      await prisma.user_has_country.findMany({
        where: {
          user_id: userId,
        },
        select: {
          country_code: true,
          s_country: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          s_country: {
            name: "asc",
          },
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
