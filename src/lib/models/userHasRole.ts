import { eq } from "drizzle-orm";
import { Err, None, Ok, Option, Some } from "ts-results";

import { HfsResult, throwToHfsError } from "../errors/HfsError";
import ModelError from "../errors/ModelError";

import { db } from "@/db";
import { role, userHasRole } from "@/db/schema";

export async function getUserRoles(userId: number): Promise<
  HfsResult<{
    userId: number;
    roles: { roleId: number; roleName: Option<string> }[];
  }>
> {
    try {
        const userRoles = await db
            .select({ roleId: userHasRole.roleId, roleName: role.name })
            .from(userHasRole)
            .where(eq(userHasRole.userId, userId))
            .leftJoin(role, eq(userHasRole.roleId, role.id));

        return Ok({
            userId: userId,
            roles: userRoles.map((ur) => ({
                roleId: ur.roleId,
                roleName: ur.roleName ? Some(ur.roleName) : None,
            }))
        });
    } catch (error) {
        return Err(
            throwToHfsError(
                500,
                ModelError.drizzleError("user_has_roles"),
                Some(error as Error),
            ),
        );
    }
}

export async function isUserAdmin(userId: number): Promise<HfsResult<boolean>> {
    const userRoles = await getUserRoles(userId);

    if (userRoles.err) {
        return Err(userRoles.val);
    }

    return Ok(userRoles.val.roles.some((r) => r.roleName === Some("admin")));
}
