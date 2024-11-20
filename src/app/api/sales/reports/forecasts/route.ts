import { NextRequest, NextResponse } from "next/server";

import { forecast } from "@/db/schema";
import { createForecast } from "@/lib/models/forecast";
import { resultToResponse } from "@/utils/conversions";
import { validateUser } from "@/actions/validate";
import { routes } from "@/config/routes";

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<typeof forecast.$inferInsert>> => {
  const userLoggedInRes = await validateUser();

  if (userLoggedInRes.err) {
    return resultToResponse(userLoggedInRes);
  }
  const { itemNo, colorCode, countryCode, amount } = await request.json();

  const result = await createForecast(itemNo, colorCode, countryCode, amount);

  return resultToResponse(result);
};
