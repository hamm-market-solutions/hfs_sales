"use server";

import { exportLatestForecasts } from "@/lib/models/forecast";
import { getOrUpdateAccessToken } from "@/lib/models/user";
import { resultToResponse } from "@/utils/conversions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
    // const accessToken = await getOrUpdateAccessToken();

    // if (accessToken.err) {
    //     return resultToResponse(accessToken);
    // }
    const forecastExportRes = await exportLatestForecasts();

    return resultToResponse(forecastExportRes);
};