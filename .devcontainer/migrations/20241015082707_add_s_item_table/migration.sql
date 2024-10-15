-- CreateTable
CREATE TABLE `s_item` (
    `no` VARCHAR(20) NOT NULL,
    `description` VARCHAR(50) NULL,
    `last` VARCHAR(30) NULL,
    `material` VARCHAR(30) NULL,
    `brand_no` VARCHAR(10) NULL,
    `cat_name` VARCHAR(10) NULL,
    `order_qty` INTEGER NULL,
    `min_qty_style` INTEGER NULL,
    `min_qty_last` INTEGER NULL,
    `season_code` SMALLINT NULL,
    `nos` SMALLINT NULL,
    `vendor_no` VARCHAR(20) NULL,
    `vendor_item_no` VARCHAR(20) NULL,
    `style_code` SMALLINT NULL,
    `tariff_no` BIGINT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
