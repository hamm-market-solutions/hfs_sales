-- CreateTable
CREATE TABLE `s_country` (
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
