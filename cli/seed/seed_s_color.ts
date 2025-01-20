import { TABLE_DATA } from "./data/s_color";

import { sColor } from "@/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sColor, TABLE_DATA.s_color);
}

export async function down() {
    await defaultDown(sColor);
}
