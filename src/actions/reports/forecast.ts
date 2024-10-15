import { routes } from "@/config/routes";
import Client from "@/lib/client";
import { GetUserCountriesRequeest } from "@/types/requests";
import { GetUserCountriesResponse } from "@/types/responses";

export async function getUserCountries() {
  const request: GetUserCountriesRequeest = {};
  const response = await Client.instance.post<GetUserCountriesResponse>(
    routes.api.users.countries,
    request,
  );

  return response;
}
