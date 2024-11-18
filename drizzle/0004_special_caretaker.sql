START TRANSACTION;--> statement-breakpoint
ALTER TABLE `s_item_color` ADD CONSTRAINT `s_item_color_item_no_s_item_no_fk` FOREIGN KEY (`item_no`) REFERENCES `s_item`(`no`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
COMMIT;