import { TABLE_DATA } from "./data/role_has_permission";

import { roleHasPermission } from "@/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(roleHasPermission, TABLE_DATA.role_has_permission);
}

export async function down() {
    await defaultDown(roleHasPermission);
}
