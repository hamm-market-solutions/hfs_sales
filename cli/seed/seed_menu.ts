import { TABLE_DATA } from "./data/menu";

import { menu } from "@/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(menu, TABLE_DATA.menu);
}

export async function down() {
    await defaultDown(menu);
}
