import { Err, None, Ok, Option, Some } from "ts-results";
import { eq } from "drizzle-orm";

import  { HfsResult, throwToHfsError } from "../errors/HfsError";
import ModelError from "../errors/ModelError";

import { db } from "@/db";
import { permission, roleHasPermission } from "@/db/schema";

export async function getRolePermissions(roleId: number): Promise<
  HfsResult<{
    roleId: number;
    permissions: { permissionId: number; permissionName: Option<string> }[];
  }>
> {
    try {
        const rolePermissions = await db
            .select({
                permissionId: roleHasPermission.permissionId,
                permissionName: permission.name,
            })
            .from(roleHasPermission)
            .where(eq(roleHasPermission.roleId, roleId))
            .leftJoin(permission, eq(roleHasPermission.permissionId, permission.id));

        return Ok({
            roleId: roleId,
            permissions: rolePermissions.map((rp) => ({
                permissionId: rp.permissionId,
                permissionName: rp.permissionName ? Some(rp.permissionName) : None,
            }))
        });
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ModelError.drizzleError("role_has_permission"),
                Some(error as Error),
            ),
        );
    }
}
