-- AlterTable
ALTER TABLE `user` ADD COLUMN `refresh_token` VARCHAR(255) NULL,
    ADD COLUMN `refresh_token_expiration` TIMESTAMP(0) NULL;
