import { TABLE_DATA } from "./data/permission";

import { permission } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(permission, TABLE_DATA.permission);
}

export async function down() {
    await defaultDown(permission);
}
