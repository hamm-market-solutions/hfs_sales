-- CreateTable
CREATE TABLE `forecast` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_no` VARCHAR(20) NOT NULL,
    `color_code` VARCHAR(10) NOT NULL,
    `amount` INTEGER NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `item_no`(`item_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `forecast` ADD CONSTRAINT `forecast_ibfk_1` FOREIGN KEY (`item_no`) REFERENCES `s_item`(`no`) ON DELETE NO ACTION ON UPDATE NO ACTION;
