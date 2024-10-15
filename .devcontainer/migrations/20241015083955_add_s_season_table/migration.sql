-- CreateTable
CREATE TABLE `s_season` (
    `code` SMALLINT NOT NULL DEFAULT 0,
    `name` VARCHAR(50) NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
