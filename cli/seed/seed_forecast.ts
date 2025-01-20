import { forecast } from "@/db/schema";
import { defaultDown } from "./default";

export async function up() {
}

export async function down() {
    await defaultDown(forecast);
}
