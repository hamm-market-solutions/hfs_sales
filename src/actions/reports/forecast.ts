import { routes } from "@/config/routes";
import Client from "@/lib/client";
import { GetUserCountriesResponse } from "@/types/responses";

export async function getUserCountries() {
  const response = await Client.instance.get<GetUserCountriesResponse>(
    routes.api.users.countries,
  );

  return response;
}
