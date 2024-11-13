START TRANSACTION;--> statement-breakpoint
ALTER TABLE `s_item` ADD CONSTRAINT `s_item_brand_no_brand_no_fk` FOREIGN KEY (`brand_no`) REFERENCES `brand`(`no`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `brand_no` ON `s_item` (`brand_no`);--> statement-breakpoint
COMMIT;