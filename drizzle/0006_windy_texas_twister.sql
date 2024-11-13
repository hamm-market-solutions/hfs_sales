START TRANSACTION;

CREATE TABLE `forecast` (
	`id` int AUTO_INCREMENT NOT NULL,
	`item_no` varchar(20) NOT NULL,
	`color_code` varchar(10) NOT NULL,
	`amount` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forecast_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `forecast` ADD CONSTRAINT `forecast_item_no_s_item_no_fk` FOREIGN KEY (`item_no`) REFERENCES `s_item`(`no`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `item_no` ON `forecast` (`item_no`);

COMMIT;