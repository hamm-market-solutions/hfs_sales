"use server";

import { Err, Ok } from "ts-results";
import { redirect } from "next/navigation";

import HfsError, { HfsResult } from "../errors/HfsError";
import { getCurrentUser, getOrUpdateAccessToken } from "../models/user";
import AuthError from "../errors/AuthError";
import { getUserPermissions } from "../models/userHasPermission";
import { isUserAdmin } from "../models/userHasRole";
import FieldError from "../errors/FieldError";

import { routePermissions, routes } from "@/config/routes";
import { cookies } from "next/headers";

export async function isUserAuthenticated(): Promise<boolean> {
  try {
    (await getOrUpdateAccessToken()).unwrap();

    return true;
  } catch (_error) {
    return false;
  }
}

export async function validateUserAuthorized(
  route?: string,
  neededPermissions?: string[],
): Promise<HfsResult<true>> {
  if ((!route && !neededPermissions) || (route && neededPermissions)) {
    return Err(
      new HfsError(
        500,
        FieldError.exactlyOneOfFieldsRequired(["route", "neededPermissions"]),
      ),
    );
  }
  await cookies(); // somehow this is needed so nextjs gets that the user is authenticated, at least if you are coming from /login
  const isAuthenticated = await isUserAuthenticated();

  if (!isAuthenticated) {
    return Err(new HfsError(403, AuthError.notAuthenticated()));
  }
  const user = await getCurrentUser();

  if (user.err) {
    return Err(user.val);
  }
  if ((await isUserAdmin(user.val.id)).unwrapOr(false)) {
    return Ok(true);
  }
  const userPermissions = await getUserPermissions(user.val.id);

  if (userPermissions.err) {
    return Err(userPermissions.val);
  }
  let permissionsNeeded: string[] = [];

  if (route) {
    permissionsNeeded = routePermissions[route];
  } else {
    permissionsNeeded = neededPermissions!;
  }
  const hasAllPermissions = matchPermissions(permissionsNeeded, userPermissions.val.permissions.map((p) => p.permissionName ?? ""));

  if (!hasAllPermissions) {
    return Err(new HfsError(401, AuthError.unauthorized()));
  }

  return Ok(true);
}

function matchPermissions(neededPermissions: string[], userPermissions: string[]) {
  return neededPermissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Validates if the user is authenticated and has the needed permissions, otherwise redirects to the login page or 401 page
 */
export async function validateUserAuthorizedOrRedirect(
  route?: string,
  neededPermissions?: string[],
): Promise<void> {
  const result = await validateUserAuthorized(route, neededPermissions);

  if (result.err) {
    if (result.val.is(AuthError.notAuthenticated())) {
      redirect(routes.login);
    } else if (result.val.is(AuthError.unauthorized())) {
      redirect("/401");
    } else {
      // redirect to 500 page
      redirect("/401");
    }
  }
}
