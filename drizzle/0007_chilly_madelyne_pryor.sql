ALTER TABLE `forecast` ADD `country_code` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `forecast` ADD `created_by` int unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `forecast` ADD CONSTRAINT `forecast_country_code_s_country_code_fk` FOREIGN KEY (`country_code`) REFERENCES `s_country`(`code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forecast` ADD CONSTRAINT `forecast_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `created_by` ON `forecast` (`created_by`);--> statement-breakpoint
CREATE INDEX `country_code` ON `forecast` (`country_code`);