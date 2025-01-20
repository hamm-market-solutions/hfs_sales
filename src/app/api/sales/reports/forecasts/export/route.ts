"use server";

import { exportLatestForecasts } from "@/lib/models/forecast";
import { resultToResponse } from "@/utils/conversions";
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse> => {
  // const accessToken = await getOrUpdateAccessToken();

  // if (accessToken.err) {
  //     return resultToResponse(accessToken);
  // }
  const forecastExportRes = await exportLatestForecasts();

  return resultToResponse(forecastExportRes);
};
