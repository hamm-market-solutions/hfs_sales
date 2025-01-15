import { eq } from "drizzle-orm";
import { Option } from "fp-ts/Option";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import ModelError from "../errors/ModelError";

import { getUserRoles } from "./userHasRole";
import { getRolePermissions } from "./roleHasPermission";

import { db } from "@/src/db";
import { permission, userHasPermission } from "@/src/db/schema";
import { Err, isErr, None, Ok, Some, unwrap } from "@/src/utils/fp-ts";

export async function getUserCustomPermissions(userId: number): Promise<
  HfsResult<{
    userId: number;
    permissions: { permissionId: number; permissionName: Option<string> }[];
  }>
> {
  try {
    const userRoles = await db
      .select({
        permissionId: userHasPermission.permissionId,
        permissionName: permission.name,
      })
      .from(userHasPermission)
      .where(eq(userHasPermission.userId, userId))
      .leftJoin(permission, eq(userHasPermission.permissionId, permission.id));

    return Ok({
      userId: userId,
      permissions: userRoles.map((ur) => ({
        permissionId: ur.permissionId,
        permissionName: ur.permissionName ? Some(ur.permissionName) : None,
      })),
    });
  } catch (error) {
    return Err(
      throwToHfsError(
        500,
        ModelError.drizzleError("user_has_permissions"),
        Some(error as Error),
      ),
    );
  }
}

export async function getUserPermissions(userId: number): Promise<
  HfsResult<{
    userId: number;
    permissions: { permissionId: number; permissionName: Option<string> }[];
  }>
> {
  try {
    const userRoles = await getUserRoles(userId);

    if (isErr(userRoles)) {
      return userRoles;
    }
    // console.log("userRoles", userRoles.val);

    const userPermissions = await getUserCustomPermissions(userId);

    if (isErr(userPermissions)) {
      return userPermissions;
    }
    const rolePermissions = [];

    for (const userRole of userRoles.left.roles) {
      const rolePermissionsResult = await getRolePermissions(userRole.roleId);

      if (isErr(rolePermissionsResult)) {
        return rolePermissionsResult;
      }
      rolePermissions.push(unwrap(rolePermissionsResult));
    }
    const permissions = userPermissions.left.permissions.concat(
      ...rolePermissions.map((role) => role.permissions),
    );

    permissions.push({ permissionId: 0, permissionName: Some("user") });

    return Ok({ userId: userId, permissions: permissions });
  } catch (error) {
    return Err(
      throwToHfsError(
        500,
        ModelError.drizzleError("user_has_permissions"),
        Some(error as Error),
      ),
    );
  }
}
