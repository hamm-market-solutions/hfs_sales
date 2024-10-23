-- AddForeignKey
ALTER TABLE `s_item_color` ADD CONSTRAINT `s_item_color_s_item_FK` FOREIGN KEY (`item_no`) REFERENCES `s_item`(`no`) ON DELETE CASCADE ON UPDATE CASCADE;
