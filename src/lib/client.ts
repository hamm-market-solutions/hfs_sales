import { Err, Ok } from "ts-results";
import { cookies } from "next/headers";

import { HfsResult } from "./errors/HfsError";
import { decodeJWT } from "./auth/jwt";

import { HfsRequest } from "@/types/requests";
import { HfsOkResponse } from "@/types/responses";
import { routes } from "@/config/routes";
import { appConfig } from "@/config/app";

export default class Client {
  private static singletonInstance: Client;
  private static accessToken: string | null = null;

  private constructor() {}

  public static get instance(): Client {
    if (!Client.singletonInstance) {
      Client.singletonInstance = new Client();
    }

    return Client.singletonInstance;
  }

  private static async handle<T extends object>(
    method: "GET" | "POST",
    url: string,
    data?: HfsRequest,
  ): Promise<HfsResult<HfsOkResponse<T>>> {
    if (!Client.accessToken && url !== routes.api.auth.login) {
      Client.refreshAccessToken();
    }
    const decoded = decodeJWT(Client.accessToken!);
    const isInvalidOrExpired =
      Client.accessToken &&
      (decoded.err || decoded.val.exp! < Date.now() / 1000);

    if (isInvalidOrExpired) {
      Client.refreshAccessToken();
    }
    switch (method) {
      case "GET":
        return Client.handleGet(appConfig.url + url);
      case "POST":
        return Client.handlePost(appConfig.url + url, data!);
    }
  }

  private static async handleGet<T extends object>(
    url: string,
  ): Promise<HfsResult<HfsOkResponse<T>>> {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Client.accessToken}`,
      },
    });
    const result = await this.handleResponse<T>(response);

    if (result.ok && url === routes.api.auth.refresh) {
      const resp = result.val as HfsOkResponse<{ accessToken: string }>;

      Client.accessToken = resp.data.accessToken;
    }

    return result;
  }

  private static async handlePost<T extends object>(
    url: string,
    data: HfsRequest,
  ): Promise<HfsResult<HfsOkResponse<T>>> {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Client.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<T>(response);

    if (result.ok && url.endsWith(routes.api.auth.login)) {
      const resp = result.val as HfsOkResponse<{ accessToken: string }>;

      Client.accessToken = resp.data.accessToken;
    }

    return result;
  }

  private static async handleResponse<T extends object>(
    response: Response,
  ): Promise<HfsResult<HfsOkResponse<T>>> {
    if (response.ok) {
      return Ok(await response.json());
    }

    return Err(await response.json());
  }

  private static async refreshAccessToken(): Promise<HfsResult<string>> {
    const response = await fetch(appConfig.url + routes.api.auth.refresh, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookies: "refreshToken=" + cookies().get("refreshToken")?.value,
      },
    });

    if (response.ok) {
      const json: HfsOkResponse<{ accessToken: string }> =
        await response.json();

      Client.accessToken = json.data.accessToken;

      return Ok(json.data.accessToken);
    }

    return Err(await response.json());
  }

  public async get<T extends object>(
    url: string,
  ): Promise<HfsResult<HfsOkResponse<T>>> {
    return Client.handle("GET", url);
  }

  public async post<T extends object>(
    url: string,
    data: HfsRequest,
  ): Promise<HfsResult<HfsOkResponse<T>>> {
    return Client.handle("POST", url, data);
  }
}
