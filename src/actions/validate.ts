"use server";

import { HfsResult } from "@/lib/errors/HfsError";
import { getOrUpdateAccessToken } from "@/lib/models/user";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import { Ok } from "ts-results";

export async function validateUser(): Promise<HfsResult<true>> {
    const accessTokenRes = await getOrUpdateAccessToken();

    if (accessTokenRes.err) {
      redirect("/login");
    }
    // (await cookies()).set("refreshToken", accessTokenRes.val.refreshToken[0], {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //     expires: accessTokenRes.val.refreshToken[1].exp! * 1000,
    // });

    return Ok(true);
};