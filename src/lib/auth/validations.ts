"use server";

import { Option } from "fp-ts/Option";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import  { HfsResult, HfsError } from "../errors/HfsError";
import { getCurrentUser, getOrUpdateAccessToken } from "../models/user";
import AuthError from "../errors/AuthError";
import { getUserPermissions } from "../models/userHasPermission";
import { isUserAdmin } from "../models/userHasRole";
import FieldError from "../errors/FieldError";

import { routePermissions, routes } from "@/config/routes";
import { Err, isErr, isNone, isSome, None, Ok, unwrap, unwrapOr } from "@/utils/fp-ts";

export async function isUserAuthenticated(): Promise<boolean> {
    try {
        unwrap((await getOrUpdateAccessToken()));

        return true;
    } catch (_) {
        return false;
    }
}

export async function validateUserAuthorized(
    route: Option<string> = None,
    neededPermissions: Option<string[]> = None,
): Promise<HfsResult<true>> {
    if ((isNone(route) && isNone(neededPermissions)) || (isSome(route) && isSome(neededPermissions))) {
        const err: HfsError = {
            status: 500,
            message: FieldError.exactlyOneOfFieldsRequired(["route", "neededPermissions"]),
            cause: None
        }
        return Err(
            err,
        );
    }
    await cookies(); // TODO: somehow this is needed so nextjs gets that the user is authenticated, at least if you are coming from /login. investigate why and find a better solution
    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
        const err: HfsError = {
            status: 403,
            message: AuthError.notAuthenticated(),
            cause: None
        }
        return Err(err);
    }
    const user = await getCurrentUser();

    if (isErr(user)) {
        return Err(user.right);
    }
    if (unwrapOr((await isUserAdmin(user.left.id)), false)) {
        return Ok(true);
    }
    const userPermissions = await getUserPermissions(user.left.id);

    if (isErr(userPermissions)) {
        return Err(userPermissions.right);
    }
    let permissionsNeeded: string[] = [];

    if (isSome(route)) {
        permissionsNeeded = routePermissions[route.value];
    } else {
        permissionsNeeded = unwrapOr(neededPermissions, []);
    }

    const hasAllPermissions = matchPermissions(
        permissionsNeeded,
        userPermissions.left.permissions.map((p) => unwrapOr(p.permissionName, "")),
    );

    if (!hasAllPermissions) {
        return Err({ status: 401, message: AuthError.unauthorized(), cause: None });
    }

    return Ok(true);
}

function matchPermissions(
    neededPermissions: string[],
    userPermissions: string[],
) {
    return neededPermissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Validates if the user is authenticated and has the needed permissions, otherwise redirects to the login page or 401 page
 */
export async function validateUserAuthorizedOrRedirect(
    route: Option<string> = None,
    neededPermissions: Option<string[]> = None,
): Promise<void> {

    const result = await validateUserAuthorized(route, neededPermissions);

    if (isErr(result)) {
        if (result.right.message == AuthError.notAuthenticated()) {
            redirect(routes.login);
        } else if (result.right.message == AuthError.unauthorized()) {
            redirect("/401");
        } else {
            // redirect to 500 page
            redirect("/401");
        }
    }
}
