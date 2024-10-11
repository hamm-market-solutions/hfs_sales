"use server";

import { cookies } from "next/headers";

import { routes } from "@/config/routes";
import Client from "@/lib/client";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from "@/types/auth";
import { LoginRequest } from "@/types/requests";

export async function handleLogin(email: string, password: string) {
  const request: LoginRequest = {
    id: 0,
    email,
    password,
  };
  const response = await Client.instance.post<{
    accessToken: string;
    refreshToken: string;
  }>(routes.api.login, request);

  if (response.err) {
    return response;
  }

  cookies().set("accessToken", response.val.data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: Date.now() + ACCESS_TOKEN_LIFETIME * 1000,
  });
  cookies().set("refreshToken", response.val.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: Date.now() + REFRESH_TOKEN_LIFETIME * 1000,
  });

  return response;
}
