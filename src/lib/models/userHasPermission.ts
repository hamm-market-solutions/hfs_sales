import { Err, None, Ok, Option, Some } from "ts-results";
import { eq } from "drizzle-orm";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import ModelError from "../errors/ModelError";

import { getUserRoles } from "./userHasRole";
import { getRolePermissions } from "./roleHasPermission";

import { db } from "@/db";
import { permission, userHasPermission } from "@/db/schema";

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
            }))
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

        if (userRoles.err) {
            return userRoles;
        }
        // console.log("userRoles", userRoles.val);

        const userPermissions = await getUserCustomPermissions(userId);

        if (userPermissions.err) {
            return userPermissions;
        }
        const rolePermissions = [];

        for (const userRole of userRoles.val.roles) {
            const rolePermissionsResult = await getRolePermissions(userRole.roleId);

            if (rolePermissionsResult.err) {
                return rolePermissionsResult;
            }
            rolePermissions.push(rolePermissionsResult.unwrap());
        }
        const permissions = userPermissions.val.permissions.concat(
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
