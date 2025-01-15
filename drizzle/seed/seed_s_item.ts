import { TABLE_DATA } from "./data/s_item";

import { sItem } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
  await defaultUp(sItem, TABLE_DATA.s_item);
}

export async function down() {
  await defaultDown(sItem);
}
