-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `brand` (
	`no` varchar(10) NOT NULL,
	`name` varchar(30) NOT NULL,
	`code` varchar(10) NOT NULL,
	`gln` varchar(50) NOT NULL DEFAULT '',
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `brand_no` PRIMARY KEY(`no`)
);
--> statement-breakpoint
CREATE TABLE `permission` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `permission_id` PRIMARY KEY(`id`),
	CONSTRAINT `permission_name_uindex` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(50),
	CONSTRAINT `role_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_name_uindex` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `role_has_permission` (
	`role_id` int NOT NULL,
	`permission_id` int unsigned NOT NULL,
	CONSTRAINT `role_has_permission_role_id_permission_id_uindex` UNIQUE(`role_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `s_country` (
	`code` varchar(10) NOT NULL,
	`name` varchar(30) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `s_country_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `s_item` (
	`no` varchar(20) NOT NULL,
	`description` varchar(50),
	`last` varchar(30),
	`material` varchar(30),
	`brand_no` varchar(10),
	`cat_name` varchar(10),
	`order_qty` int,
	`min_qty_style` int,
	`min_qty_last` int,
	`season_code` smallint,
	`nos` smallint,
	`vendor_no` varchar(20),
	`vendor_item_no` varchar(20),
	`style_code` smallint,
	`tariff_no` bigint,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `s_item_no` PRIMARY KEY(`no`)
);
--> statement-breakpoint
CREATE TABLE `s_item_color` (
	`item_no` varchar(20) NOT NULL,
	`color_code` varchar(10) NOT NULL,
	`custom_color` varchar(30),
	`purchase_price` int,
	`requested_ex_factory_date` date,
	`first_customer_shipment_date` date,
	`price_confirmed` int,
	`pre_collection` smallint NOT NULL,
	`main_collection` smallint NOT NULL,
	`late_collection` smallint NOT NULL,
	`Special_collection` smallint NOT NULL,
	`confirmed_ex_factory_date` date,
	`confirmation_sample_sent` smallint,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `unique_key` UNIQUE(`item_no`,`color_code`)
);
--> statement-breakpoint
CREATE TABLE `s_season` (
	`code` smallint NOT NULL DEFAULT 0,
	`name` varchar(50),
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `s_season_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `s_season_brand_phase` (
	`season_code` smallint NOT NULL DEFAULT 0,
	`brand_no` varchar(50),
	`phase` smallint,
	`start_date` date,
	`end_date` date,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `unique_key` UNIQUE(`season_code`,`brand_no`,`phase`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`fname` varchar(50) NOT NULL,
	`name` varchar(50) NOT NULL,
	`password` varchar(70) NOT NULL,
	`email` varchar(100) NOT NULL,
	`passwordcode` varchar(255),
	`passwordcode_time` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_uindex` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `user_has_permission` (
	`user_id` int unsigned NOT NULL,
	`permission_id` int unsigned NOT NULL,
	CONSTRAINT `user_has_permission_user_id_permission_id` PRIMARY KEY(`user_id`,`permission_id`),
	CONSTRAINT `user_has_permission_user_id_permission_id_uindex` UNIQUE(`user_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `user_has_role` (
	`user_id` int NOT NULL,
	`role_id` int NOT NULL,
	CONSTRAINT `user_has_role_user_id_role_id_uindex` UNIQUE(`user_id`,`role_id`)
);
--> statement-breakpoint
ALTER TABLE `user_has_permission` ADD CONSTRAINT `permission___fk` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_has_role` ADD CONSTRAINT `user_has_role_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `code` ON `brand` (`code`);--> statement-breakpoint
CREATE INDEX `permission_id` ON `role_has_permission` (`permission_id`);--> statement-breakpoint
CREATE INDEX `user_has_role_ibfk_2` ON `user_has_role` (`role_id`);
*/