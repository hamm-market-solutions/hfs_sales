-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `admin_settings` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`description` varchar(50),
	`value` varchar(50),
	CONSTRAINT `admin_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `approval_report` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`item_no` varchar(20) NOT NULL,
	`item_color_code` varchar(10) NOT NULL,
	`report` text NOT NULL,
	`status` tinyint NOT NULL DEFAULT 0,
	`creator_user_id` int unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `approval_report_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `approval_report_has_image` (
	`approval_report_id` int unsigned NOT NULL,
	`base64_image` longtext
);
--> statement-breakpoint
CREATE TABLE `brand` (
	`no` varchar(10) NOT NULL,
	`name` varchar(30) NOT NULL,
	`code` varchar(10) NOT NULL,
	`gln` varchar(50) NOT NULL DEFAULT '',
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brand_no` PRIMARY KEY(`no`)
);
--> statement-breakpoint
CREATE TABLE `carton` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`type` tinytext NOT NULL,
	`length` double(10,2),
	`width` double(10,2),
	`height` double(10,2),
	`weight` double(10,2),
	`creator_user_id` int NOT NULL,
	`vendor_no` varchar(20) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carton_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_key` UNIQUE(`length`,`width`,`height`,`weight`,`creator_user_id`,`vendor_no`)
);
--> statement-breakpoint
CREATE TABLE `direction` (
	`id` int NOT NULL,
	`direction` varchar(30) NOT NULL,
	CONSTRAINT `direction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_category` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`description` varchar(50) NOT NULL,
	`document_type` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `document_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	CONSTRAINT `document_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `downloaded` (
	`upload_id` int NOT NULL,
	`downloaded_by` int NOT NULL,
	`timestamp` timestamp DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `item_comment` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`item_no` varchar(20) NOT NULL,
	`comment` mediumtext NOT NULL,
	`comment_by` int unsigned NOT NULL,
	`purchasing_role` int unsigned,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `item_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loading_list` (
	`id` int AUTO_INCREMENT NOT NULL,
	`season_code` smallint,
	`status` smallint NOT NULL,
	`direction` int NOT NULL DEFAULT 0,
	`transport_type` int unsigned NOT NULL,
	`container_code` varchar(20),
	`vendor_no` varchar(20),
	`vendor_reference` varchar(50),
	`vendor_comment` mediumtext,
	`creator_user_id` int unsigned,
	`brand_no` varchar(10),
	`volume` int,
	`weight` int,
	`no_carton` int,
	`qty_pairs` int,
	`date_created` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`planned_delivery_date` date,
	`planned_delivery_time` time,
	`real_delivery_date` date,
	`real_delivery_time` time,
	`real_no_cartons` int,
	`no_fault_carton` int,
	`real_delivery_comment` mediumtext,
	`purchase_real_delivery_comment` text,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`commercial_invoice_no` varchar(50),
	`waybill` varchar(255),
	CONSTRAINT `loading_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loading_list_calendar_time` (
	`id` int unsigned NOT NULL,
	`time` time
);
--> statement-breakpoint
CREATE TABLE `loading_list_comments` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`creator_user_id` int,
	`loading_list_id` int,
	`user_role` text,
	`comment` text,
	`timestamp` timestamp DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loading_list_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loading_list_document` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`loading_list_id` int NOT NULL,
	`vendor_no` int,
	`creator_user_id` int,
	`brand_no` varchar(10),
	`container_code` varchar(20),
	`file` varchar(80),
	`document_link` tinytext,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loading_list_document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loading_list_line` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`loading_list_id` int NOT NULL,
	`creator_user_id` int,
	`order_no` varchar(20) NOT NULL,
	`order_line_no` int NOT NULL,
	`item_no` varchar(20),
	`color_code` varchar(10),
	`size_assort_code` varchar(10),
	`qty_pair` int,
	`sscc` varchar(18) NOT NULL DEFAULT '0',
	`container_code` varchar(20),
	`carton_status` smallint,
	`carton_type` smallint,
	`cancellation` smallint,
	`drop_shipment` int,
	`loading_list_direction` smallint NOT NULL DEFAULT 0,
	CONSTRAINT `loading_list_line_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loading_list_reserved_calendar_time` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`loading_list_id` int,
	`country_code` varchar(20),
	`date` date,
	`time` time,
	CONSTRAINT `loading_list_reserved_calendar_time_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loading_list_sscc_file` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`loading_list_id` int NOT NULL,
	`creator_user_id` int,
	`vendor_no` int NOT NULL,
	`folder` varchar(60) NOT NULL,
	`file` varchar(60),
	`timestamp` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `loading_list_sscc_file_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu` (
	`id` smallint unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(50) NOT NULL,
	`link` varchar(200),
	`parent_id` smallint unsigned,
	`priority` smallint NOT NULL DEFAULT 0,
	`help` tinyint unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `menu_id` PRIMARY KEY(`id`),
	CONSTRAINT `title` UNIQUE(`title`)
);
--> statement-breakpoint
CREATE TABLE `menu_has_permission` (
	`menu_id` int unsigned NOT NULL,
	`permission_id` int unsigned NOT NULL,
	CONSTRAINT `menu_has_permission_menu_id_permission_id` PRIMARY KEY(`menu_id`,`permission_id`),
	CONSTRAINT `menu_has_permission_menu_id_permission_id_uindex` UNIQUE(`menu_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `menu_has_role` (
	`menu_id` smallint unsigned NOT NULL,
	`role_id` int unsigned NOT NULL,
	CONSTRAINT `menu_has_role_menu_id_role_id` PRIMARY KEY(`menu_id`,`role_id`),
	CONSTRAINT `menu_has_role_menu_id_role_id_uindex` UNIQUE(`menu_id`,`role_id`)
);
--> statement-breakpoint
CREATE TABLE `migrations` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`file` varchar(100),
	`imported` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `migrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_file` UNIQUE(`file`)
);
--> statement-breakpoint
CREATE TABLE `permission` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `permission_id` PRIMARY KEY(`id`),
	CONSTRAINT `permission_name_uindex` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `qualities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `qualities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `returns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`avis` varchar(50) NOT NULL,
	`customer_reference` varchar(50) NOT NULL,
	`quality_id` int NOT NULL,
	`sscc` varchar(18),
	`gtin` varchar(20),
	`exported` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `returns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(50),
	CONSTRAINT `role_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_name_uindex` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `role_has_permission` (
	`role_id` int unsigned NOT NULL,
	`permission_id` int unsigned NOT NULL,
	CONSTRAINT `role_has_permission_role_id_permission_id_uindex` UNIQUE(`role_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `s_assortment` (
	`code` varchar(30) NOT NULL,
	`size_code` varchar(10) NOT NULL,
	`qty_pair` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `unique_key` UNIQUE(`code`,`size_code`)
);
--> statement-breakpoint
CREATE TABLE `s_color` (
	`code` varchar(10) NOT NULL,
	`name` varchar(30),
	`season_code` smallint NOT NULL DEFAULT 0,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `unique_key` UNIQUE(`code`,`season_code`)
);
--> statement-breakpoint
CREATE TABLE `s_country` (
	`code` varchar(10) NOT NULL,
	`name` varchar(30) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_country_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `s_customer` (
	`no` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`country_code` varchar(3),
	CONSTRAINT `s_customer_no` PRIMARY KEY(`no`)
);
--> statement-breakpoint
CREATE TABLE `s_delivery_address` (
	`order_no` varchar(20) NOT NULL,
	`name` varchar(50),
	`name_2` varchar(50),
	`address` varchar(50),
	`address_2` varchar(50),
	`post_code` varchar(30),
	`city` varchar(50),
	`country_code` varchar(10),
	`your_reference` varchar(50),
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_delivery_address_order_no` PRIMARY KEY(`order_no`)
);
--> statement-breakpoint
CREATE TABLE `s_download_center` (
	`file_name` varchar(100) NOT NULL,
	`season_code` smallint,
	`brand_no` varchar(50),
	`vendor_no` varchar(20),
	`doc_type` smallint,
	`downloaded_from` int,
	`download_time` timestamp,
	`upload_time` timestamp,
	`released` smallint,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP
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
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
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
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `unique_key` UNIQUE(`item_no`,`color_code`)
);
--> statement-breakpoint
CREATE TABLE `s_purchase_head` (
	`order_no` varchar(20) NOT NULL,
	`vendor_no` varchar(20) NOT NULL,
	`reference` varchar(50),
	`order_date` date NOT NULL,
	`customer_no` varchar(20) NOT NULL,
	`season_code` smallint NOT NULL DEFAULT 0,
	`brand_no` varchar(10) NOT NULL,
	`order_phase` varchar(10) NOT NULL,
	`customer_order_no` varchar(30),
	`status` varchar(20),
	`request_delivery_date` date,
	`release_date` date,
	`transport_type_id` smallint,
	`direction_id` smallint,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_purchase_head_order_no` PRIMARY KEY(`order_no`)
);
--> statement-breakpoint
CREATE TABLE `s_purchase_line` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_no` varchar(20) NOT NULL,
	`order_line_no` int NOT NULL,
	`item_no` varchar(20),
	`color_code` varchar(10),
	`size_assort_code` varchar(10),
	`vendor_no` varchar(20),
	`qty` int,
	`qty_pair` int,
	`requested_received_date` date,
	`last` varchar(30),
	`promised_received_date` date,
	`country_origin_code` varchar(10),
	`brand_no` varchar(10),
	`cat_name` varchar(10),
	`customer_order_no` varchar(30),
	`customer_color` varchar(20),
	`direct_unit_cost` int,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_purchase_line_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_key` UNIQUE(`order_no`,`order_line_no`)
);
--> statement-breakpoint
CREATE TABLE `s_season` (
	`code` smallint NOT NULL DEFAULT 0,
	`name` varchar(50),
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_season_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `s_season_brand_phase` (
	`season_code` smallint NOT NULL DEFAULT 0,
	`brand_no` varchar(50),
	`phase` smallint,
	`start_date` date,
	`end_date` date,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `unique_key` UNIQUE(`season_code`,`brand_no`,`phase`)
);
--> statement-breakpoint
CREATE TABLE `s_size` (
	`code` varchar(10) NOT NULL,
	`name` varchar(30),
	`qty_pair` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `s_style` (
	`code` smallint NOT NULL,
	`description` varchar(50) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_style_code` PRIMARY KEY(`code`),
	CONSTRAINT `s_style_description_uindex` UNIQUE(`description`)
);
--> statement-breakpoint
CREATE TABLE `s_variant` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`item_no` varchar(20),
	`color_code` varchar(10),
	`size_code` varchar(10),
	`gtin` varchar(20),
	`unit_sale_price` int,
	`rep_retail_price` int,
	`purchase_price` int,
	`inactive` smallint unsigned NOT NULL DEFAULT 0,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_variant_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_key` UNIQUE(`item_no`,`color_code`,`size_code`)
);
--> statement-breakpoint
CREATE TABLE `s_vendor` (
	`no` varchar(20) NOT NULL,
	`name` varchar(50),
	`country_code` varchar(5),
	`origin_harbor` varchar(20),
	`origin_harbor_country` varchar(20),
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `s_vendor_no` PRIMARY KEY(`no`)
);
--> statement-breakpoint
CREATE TABLE `shoe_box` (
	`code` smallint unsigned AUTO_INCREMENT NOT NULL,
	`sex` tinytext NOT NULL,
	`length` double(10,2),
	`width` double(10,2),
	`height` double(10,2),
	`weight` double(10,2),
	`vendor_no` varchar(20) NOT NULL,
	`creator_id` int unsigned NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shoe_box_code` PRIMARY KEY(`code`),
	CONSTRAINT `unique_key` UNIQUE(`length`,`width`,`height`,`weight`,`vendor_no`)
);
--> statement-breakpoint
CREATE TABLE `sscc` (
	`sscc` varchar(18) NOT NULL,
	`batch_identifier` varchar(255) NOT NULL,
	`serial` int NOT NULL,
	`loading_list_id` int,
	`order_no` varchar(20) NOT NULL,
	`purchase_line_id` int,
	`printed` smallint,
	`carton_type` smallint NOT NULL DEFAULT 0,
	`carton_description` varchar(20) NOT NULL,
	`creator_user_id` smallint unsigned NOT NULL,
	`canceled` smallint,
	`weight` smallint,
	`updated_by` int,
	`updated_on` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`carton_id` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `sscc_sscc` PRIMARY KEY(`sscc`)
);
--> statement-breakpoint
CREATE TABLE `sscc_line` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sscc` varchar(18) NOT NULL DEFAULT '0',
	`order_no` varchar(20) NOT NULL,
	`order_line_no` int NOT NULL,
	`purchase_line_id` int NOT NULL,
	`qty_in_carton` int,
	`creator_user_id` int NOT NULL,
	`updated_by` int,
	`canceled` smallint,
	`shoe_box_code` smallint NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sscc_line_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `style_has_box` (
	`style_code` smallint NOT NULL,
	`category` varchar(10) NOT NULL,
	`shoe_box_code` smallint unsigned NOT NULL,
	CONSTRAINT `style_has_box_style_code_category` PRIMARY KEY(`style_code`,`category`),
	CONSTRAINT `style_has_box_style_code_category_uindex` UNIQUE(`style_code`,`category`)
);
--> statement-breakpoint
CREATE TABLE `technical_report` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`item_no` varchar(20) NOT NULL,
	`report` mediumtext NOT NULL,
	`creator_user_id` int unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `technical_report_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `technical_report_has_image` (
	`technical_report_id` int unsigned,
	`base64_image` longtext
);
--> statement-breakpoint
CREATE TABLE `transport_type` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	CONSTRAINT `transport_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upload` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`file` varchar(255) NOT NULL,
	`original_filename` varchar(255) NOT NULL,
	`type` varchar(30) NOT NULL,
	`reference` varchar(50) NOT NULL,
	`uploaded_by` int NOT NULL,
	`season_code` smallint,
	`vendor_no` varchar(20),
	`item_no` varchar(20),
	`color_code` varchar(10),
	`document_cat_id` int,
	`reference_2` varchar(50),
	`reference_3` varchar(50),
	`reference_4` varchar(50),
	`comment` varchar(255),
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`customer_no` varchar(20),
	CONSTRAINT `upload_id` PRIMARY KEY(`id`)
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
	`user_id` int unsigned NOT NULL,
	`role_id` int unsigned NOT NULL,
	CONSTRAINT `user_has_role_user_id_role_id` PRIMARY KEY(`user_id`,`role_id`),
	CONSTRAINT `user_has_role_user_id_role_id_uindex` UNIQUE(`user_id`,`role_id`)
);
--> statement-breakpoint
CREATE TABLE `user_has_vendor` (
	`user_id` int unsigned NOT NULL,
	`vendor_no` varchar(20) NOT NULL,
	CONSTRAINT `user_has_vendor_user_id_vendor_no` PRIMARY KEY(`user_id`,`vendor_no`),
	CONSTRAINT `user_has_vendor_user_id_vendor_no_uindex` UNIQUE(`user_id`,`vendor_no`)
);
--> statement-breakpoint
CREATE TABLE `variant_has_box` (
	`item_no` int unsigned,
	`size_code` varchar(10),
	`shoe_box_no` smallint unsigned
);
--> statement-breakpoint
CREATE TABLE `variant_weight` (
	`item_no` varchar(20),
	`size_code` varchar(10),
	`weight` smallint unsigned NOT NULL,
	`creator_user_id` smallint unsigned NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `unique_key` UNIQUE(`weight`,`item_no`,`size_code`)
);
--> statement-breakpoint
ALTER TABLE `approval_report` ADD CONSTRAINT `approval_report_ibfk_1` FOREIGN KEY (`creator_user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `approval_report_has_image` ADD CONSTRAINT `approval_report_has_image_ibfk_1` FOREIGN KEY (`approval_report_id`) REFERENCES `approval_report`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `document_category` ADD CONSTRAINT `fk_doc_type` FOREIGN KEY (`document_type`) REFERENCES `document_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_comment` ADD CONSTRAINT `item_comment_ibfk_1` FOREIGN KEY (`comment_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_comment` ADD CONSTRAINT `item_comment_ibfk_2` FOREIGN KEY (`purchasing_role`) REFERENCES `role`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loading_list` ADD CONSTRAINT `loading_list_ibfk_1` FOREIGN KEY (`vendor_no`) REFERENCES `s_vendor`(`no`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loading_list` ADD CONSTRAINT `loading_list_ibfk_2` FOREIGN KEY (`brand_no`) REFERENCES `brand`(`no`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loading_list` ADD CONSTRAINT `loading_list_ibfk_3` FOREIGN KEY (`season_code`) REFERENCES `s_season`(`code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loading_list` ADD CONSTRAINT `loading_list_ibfk_4` FOREIGN KEY (`direction`) REFERENCES `direction`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loading_list` ADD CONSTRAINT `loading_list_ibfk_5` FOREIGN KEY (`creator_user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loading_list` ADD CONSTRAINT `loading_list_ibfk_6` FOREIGN KEY (`transport_type`) REFERENCES `transport_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loading_list_reserved_calendar_time` ADD CONSTRAINT `loading_list_reserved_calendar_time_ibfk_1` FOREIGN KEY (`loading_list_id`) REFERENCES `loading_list`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `loading_list_reserved_calendar_time` ADD CONSTRAINT `loading_list_reserved_calendar_time_ibfk_2` FOREIGN KEY (`country_code`) REFERENCES `s_country`(`code`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `menu_has_permission` ADD CONSTRAINT `permision___fk` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `menu_has_role` ADD CONSTRAINT `menu___fk` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `returns` ADD CONSTRAINT `fk_quality` FOREIGN KEY (`quality_id`) REFERENCES `qualities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `technical_report` ADD CONSTRAINT `technical_report_ibfk_1` FOREIGN KEY (`creator_user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `technical_report_has_image` ADD CONSTRAINT `technical_report_has_image_ibfk_1` FOREIGN KEY (`technical_report_id`) REFERENCES `technical_report`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_has_permission` ADD CONSTRAINT `permission___fk` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_has_role` ADD CONSTRAINT `user___fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_has_vendor` ADD CONSTRAINT `user____fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `creator_user_id` ON `approval_report` (`creator_user_id`);--> statement-breakpoint
CREATE INDEX `approval_report_id` ON `approval_report_has_image` (`approval_report_id`);--> statement-breakpoint
CREATE INDEX `code` ON `brand` (`code`);--> statement-breakpoint
CREATE INDEX `upload_id` ON `downloaded` (`upload_id`);--> statement-breakpoint
CREATE INDEX `downloaded_by` ON `downloaded` (`downloaded_by`);--> statement-breakpoint
CREATE INDEX `comment_by` ON `item_comment` (`comment_by`);--> statement-breakpoint
CREATE INDEX `purchasing_role` ON `item_comment` (`purchasing_role`);--> statement-breakpoint
CREATE INDEX `loading_list_id` ON `loading_list_reserved_calendar_time` (`loading_list_id`);--> statement-breakpoint
CREATE INDEX `country_code` ON `loading_list_reserved_calendar_time` (`country_code`);--> statement-breakpoint
CREATE INDEX `role___fk` ON `menu_has_role` (`menu_id`);--> statement-breakpoint
CREATE INDEX `s_assortment_code_index` ON `s_assortment` (`code`);--> statement-breakpoint
CREATE INDEX `s_assortment_size_code_index` ON `s_assortment` (`size_code`);--> statement-breakpoint
CREATE INDEX `s_assortment_qty_pair_index` ON `s_assortment` (`qty_pair`);--> statement-breakpoint
CREATE INDEX `s_purchase_line_color_code_index` ON `s_purchase_line` (`color_code`);--> statement-breakpoint
CREATE INDEX `s_purchase_line_item_no_index` ON `s_purchase_line` (`item_no`);--> statement-breakpoint
CREATE INDEX `size_assort_code` ON `s_purchase_line` (`size_assort_code`);--> statement-breakpoint
CREATE INDEX `s_variant_item_no_index` ON `s_variant` (`item_no`);--> statement-breakpoint
CREATE INDEX `s_variant_size_code_index` ON `s_variant` (`size_code`);--> statement-breakpoint
CREATE INDEX `sscc_canceled_index` ON `sscc` (`canceled`);--> statement-breakpoint
CREATE INDEX `sscc_line_order_no_index` ON `sscc_line` (`order_no`);--> statement-breakpoint
CREATE INDEX `sscc_line_purchase_line_id_index` ON `sscc_line` (`purchase_line_id`);--> statement-breakpoint
CREATE INDEX `sscc_line_qty_in_carton_index` ON `sscc_line` (`qty_in_carton`);--> statement-breakpoint
CREATE INDEX `sscc_line_canceled_index` ON `sscc_line` (`canceled`);--> statement-breakpoint
CREATE INDEX `sscc_line_sscc_index` ON `sscc_line` (`sscc`);--> statement-breakpoint
CREATE INDEX `creator_user_id` ON `technical_report` (`creator_user_id`);--> statement-breakpoint
CREATE INDEX `technical_report_id` ON `technical_report_has_image` (`technical_report_id`);--> statement-breakpoint
CREATE INDEX `upload_type_index` ON `upload` (`type`);--> statement-breakpoint
CREATE INDEX `upload_reference_index` ON `upload` (`reference`);--> statement-breakpoint
CREATE INDEX `role___fk` ON `user_has_role` (`role_id`);--> statement-breakpoint
CREATE INDEX `vendor__fk` ON `user_has_vendor` (`vendor_no`);--> statement-breakpoint
CREATE INDEX `variant_weight_item_no_index` ON `variant_weight` (`item_no`);--> statement-breakpoint
CREATE INDEX `variant_weight_weight_index` ON `variant_weight` (`weight`);--> statement-breakpoint
CREATE INDEX `variant_weight_size_code_index` ON `variant_weight` (`size_code`);
*/