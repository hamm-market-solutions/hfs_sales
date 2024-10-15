-- CreateTable
CREATE TABLE `user_has_country` (
    `user_id` INTEGER NOT NULL,
    `country_code` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `user_has_country_user_id_country_code_uindex`(`user_id`, `country_code`),
    PRIMARY KEY (`user_id`, `country_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_has_country` ADD CONSTRAINT `user__fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_has_country` ADD CONSTRAINT `country__fk` FOREIGN KEY (`country_code`) REFERENCES `s_country`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;
