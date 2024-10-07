import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJwtToUser1728288434659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "token" VARCHAR(255) DEFAULT NULL;
      ALTER TABLE "user"
      ADD COLUMN "token_expiration" TIMESTAMP DEFAULT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN "token";
      ALTER TABLE "user"
      DROP COLUMN "token_expiration";
    `);
  }
}
