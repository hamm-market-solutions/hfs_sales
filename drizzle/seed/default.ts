import { chunkArray } from "../../src/utils/chunker";
import { toCamelCase } from "drizzle-orm/casing";
import { drizzle } from "drizzle-orm/mysql2";

export const defaultUp = async (
  table: any,
  data: { [key: string]: unknown }[],
) => {
  const db = drizzle(process.env.DATABASE_URL!);
  // the same as `data` but the data keys are camelCased
  const formattedData = data.map((row) => {
    const formattedRow: any = {};

    for (const key in row) {
      formattedRow[toCamelCase(key)] = row[
        key
      ];
    }

    return formattedRow;
  });
  const chunkedData = chunkArray(formattedData, 500);

  await db.transaction(async (tx) => {
    for (const chunk of chunkedData) {
      await tx.insert(table).values(chunk);
    }
  });
};

export const defaultDown = async (table: any) => {
  const db = drizzle(process.env.DATABASE_URL!);

  await db.transaction(async (tx) => {
    await tx.delete(table);
  });
};
