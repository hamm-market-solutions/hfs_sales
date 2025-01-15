import { TABLE_DATA } from "./data/user_has_role";

import { userHasRole } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(userHasRole, TABLE_DATA.user_has_role);
}

export async function down() {
    await defaultDown(userHasRole);
}
