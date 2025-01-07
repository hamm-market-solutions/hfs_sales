import { TABLE_DATA } from "./data/s_purchase_head";

import { sPurchaseHead } from "@/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sPurchaseHead, TABLE_DATA.s_purchase_head);
}

export async function down() {
    await defaultDown(sPurchaseHead);
}
