import { NextRequest, NextResponse } from "next/server";
import { Ok } from "ts-results";

import { updateAccessToken } from "@/lib/models/user";
import { getRefreshTokenAndVerify } from "@/lib/auth/jwt";
import {
  HfsResponse,
  RefreshErrResponse,
  RefreshOkResponse,
  RefreshResponse,
} from "@/types/responses";
import { resultToResponse } from "@/utils/conversions";

export async function GET(): Promise<NextResponse<RefreshResponse>> {
  const refreshTokenRes = await getRefreshTokenAndVerify();

  if (refreshTokenRes.err) {
    return resultToResponse(
      refreshTokenRes,
    ) as NextResponse<RefreshErrResponse>;
  }

  const accessTokenRes = await updateAccessToken(
    parseInt(refreshTokenRes.val[1].sub!),
  );

  if (accessTokenRes.err) {
    return resultToResponse(accessTokenRes) as NextResponse<RefreshErrResponse>;
  }

  return resultToResponse(
    Ok({ accessToken: accessTokenRes.val.accessToken }),
  ) as NextResponse<RefreshOkResponse>;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<HfsResponse>> {
  const post = await request.json();
  const optRefreshToken: string | undefined = post.refreshToken;
  const refreshTokenRes = await getRefreshTokenAndVerify(optRefreshToken);

  if (refreshTokenRes.err) {
    return resultToResponse(refreshTokenRes);
  }
  const accessTokenRes = await updateAccessToken(
    parseInt(refreshTokenRes.val[1].sub!),
  );

  if (accessTokenRes.err) {
    return resultToResponse(accessTokenRes);
  }

  return resultToResponse(
    Ok({ accessToken: accessTokenRes.val.accessToken[0] }),
  );
}
