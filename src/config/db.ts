import "../envConfig.js";

export const dbConfig = {
  dbCredentials: {
    username: process.env.MYSQL_USER ?? "root",
    password: process.env.MYSQL_PASSWORD!,
  },
  dbConnection: {
    host: process.env.MYSQL_HOST!,
    port: parseInt(process.env.MYSQL_TCP_PORT!),
    database: process.env.MYSQL_DATABASE!,
  },
};
