import { eq } from "drizzle-orm";
import { Err, Ok } from "ts-results";

import HfsError, { HfsResult } from "../errors/HfsError";
import ModelError from "../errors/ModelError";

import { db } from "@/db";
import { role, userHasRole } from "@/db/schema";

export async function getUserRoles(userId: number): Promise<
  HfsResult<{
    userId: number;
    roles: { roleId: number; roleName: string | null }[];
  }>
> {
  try {
    const userRoles = await db
      .select({ roleId: userHasRole.roleId, roleName: role.name })
      .from(userHasRole)
      .where(eq(userHasRole.userId, userId))
      .leftJoin(role, eq(userHasRole.roleId, role.id));

    return Ok({ userId: userId, roles: userRoles });
  } catch (error) {
    return Err(
      HfsError.fromThrow(
        500,
        ModelError.drizzleError("user_has_roles"),
        error as Error,
      ),
    );
  }
}
