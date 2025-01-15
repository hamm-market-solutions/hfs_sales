import { TABLE_DATA } from "./data/s_assortment";

import { sAssortment } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sAssortment, TABLE_DATA.s_assortment);
}

export async function down() {
    await defaultDown(sAssortment);
}
