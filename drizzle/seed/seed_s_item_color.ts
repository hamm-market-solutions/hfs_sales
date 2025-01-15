import { TABLE_DATA } from "./data/s_item_color";

import { sItemColor } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sItemColor, TABLE_DATA.s_item_color);
}

export async function down() {
    await defaultDown(sItemColor);
}
