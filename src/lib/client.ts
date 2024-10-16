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
  private accessToken: string | null = null;

  private constructor() {}

  public static get instance(): Client {
    if (!Client.singletonInstance) {
      Client.singletonInstance = new Client();
    }

    return Client.singletonInstance;
  }

  private async handle<T extends object>(
    method: "GET" | "POST",
    url: string,
    data?: HfsRequest,
  ): Promise<HfsResult<T>> {
    if (this.accessToken == null && url !== routes.api.auth.login) {
      (await this.refreshAccessToken()).unwrap();
    }

    const decoded = decodeJWT(this.accessToken!);
    const isInvalidOrExpired =
      this.accessToken && (decoded.err || decoded.val.exp! < Date.now() / 1000);

    if (isInvalidOrExpired) {
      await this.refreshAccessToken();
    }
    switch (method) {
      case "GET":
        return await this.handleGet(appConfig.url + url);
      case "POST":
        return await this.handlePost(appConfig.url + url, data!);
    }
  }

  private async handleGet<T extends object>(
    url: string,
  ): Promise<HfsResult<T>> {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const result = await this.handleResponse<T>(response);

    if (result.ok && url === routes.api.auth.refresh) {
      const resp = result.val as HfsOkResponse<{ accessToken: string }>;

      this.accessToken = resp.data.accessToken;
    }

    return result;
  }

  private async handlePost<T extends object>(
    url: string,
    data: HfsRequest,
  ): Promise<HfsResult<T>> {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<T>(response);

    if (result.ok && url.endsWith(routes.api.auth.login)) {
      const resp = result.val as HfsOkResponse<{ accessToken: string }>;

      this.accessToken = resp.data.accessToken;
    }

    return result;
  }

  private async handleResponse<T extends object>(
    response: Response,
  ): Promise<HfsResult<T>> {
    if (response.ok) {
      return Ok(await response.json());
    }

    return Err(await response.json());
  }

  private async refreshAccessToken(): Promise<HfsResult<string>> {
    const response = await fetch(appConfig.url + routes.api.auth.refresh, {
      method: "POST",
      body: JSON.stringify({
        refreshToken: cookies().get("refreshToken")?.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const json: HfsOkResponse<{ accessToken: string }> =
        await response.json();

      this.accessToken = json.data.accessToken;

      return Ok(json.data.accessToken);
    }

    return Err(await response.json());
  }

  public async get<T extends object>(url: string): Promise<HfsResult<T>> {
    return await this.handle("GET", url);
  }

  public async post<T extends object>(
    url: string,
    data: HfsRequest,
  ): Promise<HfsResult<T>> {
    return await this.handle("POST", url, data);
  }
}
