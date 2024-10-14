-- CreateTable
CREATE TABLE `user_has_permission` (
    `user_id` INTEGER UNSIGNED NOT NULL,
    `permission_id` INTEGER UNSIGNED NOT NULL,

    INDEX `permission___fk`(`permission_id`),
    UNIQUE INDEX `user_has_permission_user_id_permission_id_uindex`(`user_id`, `permission_id`),
    PRIMARY KEY (`user_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_has_permission` ADD CONSTRAINT `permission___fk` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
