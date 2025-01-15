import { TABLE_DATA } from "./data/s_country";

import { sCountry } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
  await defaultUp(sCountry, TABLE_DATA.s_country);
}

export async function down() {
  await defaultDown(sCountry);
}
