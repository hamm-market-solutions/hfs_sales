"use server";

import { redirect } from "next/navigation";
import React from "react";

import { routes } from "@/config/routes";
import {
  isUserAuthenticated,
  validateUserAuthorized,
} from "@/lib/auth/validations";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  // const userAuthorizedRes = await validateUserAuthorized(pathname ?? "");
  // console.log("userAuthorizedRes", userAuthorizedRes);


  // if (userAuthorizedRes.err) {
  //   return (
  //     <div>
  //       <h2>User unauthorized to access</h2>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
