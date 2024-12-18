import { Err, Ok } from "ts-results";
import { eq } from "drizzle-orm";

import HfsError, { HfsResult } from "../errors/HfsError";
import ModelError from "../errors/ModelError";

import { db } from "@/db";
import { permission, roleHasPermission } from "@/db/schema";

export async function getRolePermissions(roleId: number): Promise<
  HfsResult<{
    roleId: number;
    permissions: { permissionId: number; permissionName: string | null }[];
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

        return Ok({ roleId: roleId, permissions: rolePermissions });
    } catch (error) {
        return Err(
            HfsError.fromThrow(
                500,
                ModelError.drizzleError("role_has_permission"),
        error as Error,
            ),
        );
    }
}
