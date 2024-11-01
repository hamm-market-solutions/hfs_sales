/*
  Warnings:

  - Added the required column `country_code` to the `forecast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `forecast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `forecast` ADD COLUMN `country_code` VARCHAR(10) NOT NULL,
    ADD COLUMN `created_by` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `country_code` ON `forecast`(`country_code`);

-- CreateIndex
CREATE INDEX `created_by` ON `forecast`(`created_by`);

-- AddForeignKey
ALTER TABLE `forecast` ADD CONSTRAINT `forecast_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `forecast` ADD CONSTRAINT `forecast_ibfk_3` FOREIGN KEY (`country_code`) REFERENCES `s_country`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;
