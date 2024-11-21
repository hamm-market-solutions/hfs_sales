-- CreateTable
CREATE TABLE `brand` (
    `no` VARCHAR(10) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `code` VARCHAR(10) NOT NULL,
    `gln` VARCHAR(50) NOT NULL DEFAULT '',
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `code`(`code`),
    PRIMARY KEY (`no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
