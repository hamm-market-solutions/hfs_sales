import { NextRequest, NextResponse } from "next/server";
import * as O from "fp-ts/Option";

import { updateAccessToken } from "@/src/lib/models/user";
import { getRefreshTokenAndVerify } from "@/src/lib/auth/jwt";
import {
  HfsResponse,
  RefreshErrResponse,
  RefreshOkResponse,
  RefreshResponse,
} from "@/src/types/responses";
import { resultToResponse } from "@/src/utils/conversions";
import { isErr, Ok } from "@/src/utils/fp-ts";

export async function GET(): Promise<NextResponse<RefreshResponse>> {
  const refreshTokenRes = await getRefreshTokenAndVerify();

  if (isErr(refreshTokenRes)) {
    return resultToResponse(
      refreshTokenRes,
    ) as NextResponse<RefreshErrResponse>;
  }

  const accessTokenRes = await updateAccessToken(
    parseInt(refreshTokenRes.left[1].sub!),
  );

  if (isErr(accessTokenRes)) {
    return resultToResponse(accessTokenRes) as NextResponse<RefreshErrResponse>;
  }

  return resultToResponse(
    Ok({ accessToken: accessTokenRes.left.accessToken }),
  ) as NextResponse<RefreshOkResponse>;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<HfsResponse<{ accessToken: string }>>> {
  const post = await request.json();
  const optRefreshToken: O.Option<string> = post.refreshToken;
  const refreshTokenRes = await getRefreshTokenAndVerify(optRefreshToken);

  if (isErr(refreshTokenRes)) {
    return resultToResponse(refreshTokenRes);
  }
  const accessTokenRes = await updateAccessToken(
    parseInt(refreshTokenRes.left[1].sub!),
  );

  if (isErr(accessTokenRes)) {
    return resultToResponse(accessTokenRes);
  }

  return resultToResponse(
    Ok({ accessToken: accessTokenRes.left.accessToken[0] }),
  );
}
