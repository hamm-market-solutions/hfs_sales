import { TABLE_DATA } from "./data/s_season_brand_phase";

import { sSeasonBrandPhase } from "../../src/db/schema";
import { defaultDown, defaultUp } from "./default";

export async function up() {
    await defaultUp(sSeasonBrandPhase, TABLE_DATA.s_season_brand_phase);
}

export async function down() {
    await defaultDown(sSeasonBrandPhase);
}
