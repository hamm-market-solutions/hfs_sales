import { cookies } from "next/headers";

export const isUserAuthenticated = () => {
  return cookies;
};
