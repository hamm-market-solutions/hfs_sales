"use server";

import { cookies } from "next/headers";

import { routes } from "@/config/routes";
import Client from "@/lib/client";
import { LoginRequest } from "@/types/requests";
import { decodeJWT } from "@/lib/auth/jwt";

export async function handleLogin(email: string, password: string) {
  const request: LoginRequest = {
    email,
    password,
  };
  const response = await Client.instance.post<{
    accessToken: string;
    refreshToken: string;
  }>(routes.api.auth.login, request);

  if (response.err) {
    return response;
  }

  const accessTokenExp = decodeJWT(response.val.data.accessToken).unwrap().exp!;
  const refreshTokenExp = decodeJWT(response.val.data.refreshToken).unwrap()
    .exp!;

  cookies().set("accessToken", response.val.data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: accessTokenExp * 1000,
  });
  cookies().set("refreshToken", response.val.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: refreshTokenExp * 1000,
  });

  return response;
}
