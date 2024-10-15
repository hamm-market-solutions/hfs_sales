-- CreateTable
CREATE TABLE `role_has_permission` (
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER UNSIGNED NOT NULL,

    INDEX `permission_id`(`permission_id`),
    UNIQUE INDEX `role_has_permission_role_id_permission_id_uindex`(`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
