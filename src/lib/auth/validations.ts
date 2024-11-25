import { Err, Ok } from "ts-results";
import HfsError, { HfsResult } from "../errors/HfsError";
import { getCurrentUser, getOrUpdateAccessToken } from "../models/user";
import AuthError from "../errors/AuthError";
import { getUserPermissions } from "../models/userHasPermission";
import { routePermissions } from "@/config/routes";

export async function isUserAuthenticated(): Promise<boolean> {
  try {
    (await getOrUpdateAccessToken()).unwrap();

    return true;
  } catch (_error) {
    return false;
  }
}

export async function validateUserAuthorized(route: string): Promise<HfsResult<true>> {
    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
        return Err(new HfsError(403, AuthError.notAuthenticated()));
    }
    const user = await getCurrentUser();

    if (user.err) {
        return Err(user.val);
    }
    const userPermissions = await getUserPermissions(user.val.id);
    console.log("userPermissions", userPermissions);

    if (userPermissions.err) {
        return Err(userPermissions.val);
    }
    const routePerm = routePermissions[route];
    const hasAllPermissions = routePerm.every((perm) => userPermissions.val.permissions.map((p) => p.permissionName).includes(perm));

    if (!hasAllPermissions) {
        return Err(new HfsError(403, AuthError.unauthorized()));
    }

    return Ok(true);
}
