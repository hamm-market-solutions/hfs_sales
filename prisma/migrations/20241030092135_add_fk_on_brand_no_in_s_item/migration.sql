-- CreateIndex
CREATE INDEX `brand_no` ON `s_item`(`brand_no`);

-- AddForeignKey
ALTER TABLE `s_item` ADD CONSTRAINT `s_item_ibfk_1` FOREIGN KEY (`brand_no`) REFERENCES `brand`(`no`) ON DELETE NO ACTION ON UPDATE NO ACTION;
