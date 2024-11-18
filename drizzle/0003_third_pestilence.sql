START TRANSACTION;--> statement-breakpoint
CREATE TABLE `user_has_country` (
	`user_id` int unsigned NOT NULL,
	`country_code` varchar(10) NOT NULL,
	CONSTRAINT `user_has_country_user_id_country_code` PRIMARY KEY(`user_id`,`country_code`),
	CONSTRAINT `user_has_country_user_id_country_code_uindex` UNIQUE(`user_id`,`country_code`)
);--> statement-breakpoint
COMMIT;