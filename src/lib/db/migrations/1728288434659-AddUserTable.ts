import { MigrationInterface, QueryRunner } from "typeorm";

import { appConfig } from "@/config/app";

export class AddUserTable1728288434659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (appConfig.env !== "development") {
      return;
    }

    await queryRunner.query(`
      CREATE TABLE user (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fname VARCHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        password VARCHAR(70) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        passwordcode VARCHAR(255),
        passwordcode_time TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (appConfig.env !== "development") {
      return;
    }

    await queryRunner.query("DROP TABLE user;");
  }
}
