import { TABLE_DATA } from "./data/user_has_country";

import { userHasCountry } from "@/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(userHasCountry, TABLE_DATA.user_has_country);
}

export async function down() {
    await defaultDown(userHasCountry);
}
