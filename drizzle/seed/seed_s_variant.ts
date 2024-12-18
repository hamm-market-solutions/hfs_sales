import { drizzle } from "drizzle-orm/mysql2";

import { TABLE_DATA } from "./data/s_variant";

import { sVariant } from "@/db/schema";
import { snakeCaseToCamelCase } from "@/utils/conversions";
import { chunkArray } from "@/utils/chunker";

export async function up() {
  const db = drizzle(process.env.DATABASE_URL!);
  const data = TABLE_DATA["s_variant"];
  // the same as `data` but the data keys are camelCased
  const formattedData = data.map((row) => {
    const formattedRow: any = {};

    for (const key in row) {
      // @ts-ignore
      formattedRow[snakeCaseToCamelCase(key)] = row[
        key
      ];
    }

    return formattedRow;
  });
  const chunkedData = chunkArray(formattedData, 500);

  await db.transaction(async (tx) => {
    for (const chunk of chunkedData) {
      await tx.insert(sVariant).values(chunk);
    }
  });
}

export async function down() {
  const db = drizzle(process.env.DATABASE_URL!);

  await db.transaction(async (tx) => {
    await tx.delete(sVariant);
  });
}
