-- AlterTable
ALTER TABLE `user` ADD COLUMN `jwt` VARCHAR(255) NULL,
    ADD COLUMN `jwt_expiration` TIMESTAMP(0) NULL;
