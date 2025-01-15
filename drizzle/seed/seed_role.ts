import { TABLE_DATA } from "./data/role";

import { role } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(role, TABLE_DATA.role);
}

export async function down() {
    await defaultDown(role);
}
