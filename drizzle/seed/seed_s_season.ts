import { TABLE_DATA } from "./data/s_season";

import { sSeason } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sSeason, TABLE_DATA.s_season);
}

export async function down() {
    await defaultDown(sSeason);
}
