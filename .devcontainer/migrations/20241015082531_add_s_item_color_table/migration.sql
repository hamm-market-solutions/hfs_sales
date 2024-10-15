-- CreateTable
CREATE TABLE `s_item_color` (
    `item_no` VARCHAR(20) NOT NULL,
    `color_code` VARCHAR(10) NOT NULL,
    `custom_color` VARCHAR(30) NULL,
    `purchase_price` INTEGER NULL,
    `requested_ex_factory_date` DATE NULL,
    `first_customer_shipment_date` DATE NULL,
    `price_confirmed` INTEGER NULL,
    `pre_collection` SMALLINT NOT NULL,
    `main_collection` SMALLINT NOT NULL,
    `late_collection` SMALLINT NOT NULL,
    `Special_collection` SMALLINT NOT NULL,
    `confirmed_ex_factory_date` DATE NULL,
    `confirmation_sample_sent` SMALLINT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unique_key`(`item_no`, `color_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
