CREATE TABLE `permission` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `permission_id` PRIMARY KEY(`id`),
	CONSTRAINT `permission_name_uindex` UNIQUE(`name`)
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
