CREATE TABLE `user_has_country` (
	`user_id` int unsigned NOT NULL,
	`country_code` varchar(10) NOT NULL,
	CONSTRAINT `user_has_country_user_id_country_code` PRIMARY KEY(`user_id`,`country_code`),
	CONSTRAINT `user_has_country_user_id_country_code_uindex` UNIQUE(`user_id`,`country_code`)
);
--> statement-breakpoint
ALTER TABLE `user_has_permission` DROP FOREIGN KEY `permission___fk`;
--> statement-breakpoint
ALTER TABLE `user_has_role` DROP FOREIGN KEY `user_has_role_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `brand` MODIFY COLUMN `timestamp` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s_country` MODIFY COLUMN `timestamp` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s_item` MODIFY COLUMN `timestamp` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s_item_color` MODIFY COLUMN `timestamp` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s_season` MODIFY COLUMN `code` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `s_season` MODIFY COLUMN `timestamp` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s_season_brand_phase` MODIFY COLUMN `season_code` smallint NOT NULL;--> statement-breakpoint
ALTER TABLE `s_season_brand_phase` MODIFY COLUMN `timestamp` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `user_has_country` ADD CONSTRAINT `user_has_country_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `user_has_country` ADD CONSTRAINT `user_has_country_country_code_s_country_code_fk` FOREIGN KEY (`country_code`) REFERENCES `s_country`(`code`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `country_code` ON `user_has_country` (`country_code`);--> statement-breakpoint
ALTER TABLE `user_has_permission` ADD CONSTRAINT `user_has_permission_permission_id_permission_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_has_role` ADD CONSTRAINT `user_has_role_role_id_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE cascade ON UPDATE cascade;