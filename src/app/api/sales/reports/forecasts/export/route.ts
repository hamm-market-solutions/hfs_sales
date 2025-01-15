"use server";

import { exportLatestForecasts } from "@/src/lib/models/forecast";
import { resultToResponse } from "@/src/utils/conversions";
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse> => {
  // const accessToken = await getOrUpdateAccessToken();

  // if (accessToken.err) {
  //     return resultToResponse(accessToken);
  // }
  const forecastExportRes = await exportLatestForecasts();

  return resultToResponse(forecastExportRes);
};
