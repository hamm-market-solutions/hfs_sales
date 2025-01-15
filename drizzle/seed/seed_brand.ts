import { TABLE_DATA } from "./data/brand";

import { brand } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(brand, TABLE_DATA.brand);
}

export async function down() {
    await defaultDown(brand);
}
