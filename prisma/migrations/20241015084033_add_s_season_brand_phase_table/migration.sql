-- CreateTable
CREATE TABLE `s_season_brand_phase` (
    `season_code` SMALLINT NOT NULL DEFAULT 0,
    `brand_no` VARCHAR(50) NULL,
    `phase` SMALLINT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unique_key`(`season_code`, `brand_no`, `phase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
