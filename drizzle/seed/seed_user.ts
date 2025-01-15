import { TABLE_DATA } from "./data/user";

import { user } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(user, TABLE_DATA.user);
}

export async function down() {
    await defaultDown(user);
}
