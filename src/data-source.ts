/**
 * The data source is the main entry point for the TypeORM library.
 */

import { DataSource } from "typeorm";

import { dbConfig } from "@/config/db";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: dbConfig.dbConnection.host,
  port: dbConfig.dbConnection.port,
  database: dbConfig.dbConnection.database,
  username: dbConfig.dbCredentials.username,
  password: dbConfig.dbCredentials.password,
  synchronize: true,
  logging: true,
  entities: ["./models/entities/**/*.ts"],
  migrations: ["./migrations/**/*.ts"],
});
