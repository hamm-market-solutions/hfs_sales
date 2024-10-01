import { DataSource } from "typeorm";

import { ormConfig } from "@/config/orm";

const AppDataSource = new DataSource({
  type: "mysql",
  host: ormConfig.dbConnection.host,
  port: ormConfig.dbConnection.port,
  database: ormConfig.dbConnection.database,
  username: ormConfig.dbCredentials.username,
  password: ormConfig.dbCredentials.password,
  synchronize: true,
  logging: true,
  entities: ["./entities/**/*.ts"],
  migrations: ["./migrations/**/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
