import { TABLE_DATA } from "./data/s_purchase_line";

import { sPurchaseLine } from "@/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sPurchaseLine, TABLE_DATA.s_purchase_line);
}

export async function down() {
    await defaultDown(sPurchaseLine);
}
