import { drizzle } from "drizzle-orm/mysql2";

import { TABLE_DATA } from "./data/s_assortment";

import { sAssortment } from "@/db/schema";
import { snakeCaseToCamelCase } from "@/utils/conversions";

export async function up() {
  const db = drizzle(process.env.DATABASE_URL!);
  const data = TABLE_DATA["s_assortment"];
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

  await db.transaction(async (tx) => {
    await tx.insert(sAssortment).values(formattedData);
  });
}

export async function down() {
  const db = drizzle(process.env.DATABASE_URL!);

  await db.transaction(async (tx) => {
    await tx.delete(sAssortment);
  });
}
