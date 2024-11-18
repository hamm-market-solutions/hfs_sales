"use server";

import { redirect } from "next/navigation";
import React from "react";

import { validateUser } from "@/actions/validate";
import { routes } from "@/config/routes";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userLoggedInRes = await validateUser();

  if (userLoggedInRes.err) {
    redirect(routes.login);
  }

  return <>{children}</>;
}
