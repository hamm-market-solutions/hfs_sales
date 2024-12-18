import { TABLE_DATA } from "./data/s_variant";

import { sVariant } from "@/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sVariant, TABLE_DATA.s_variant);
}

export async function down() {
    await defaultDown(sVariant);
}
