-- Disable foreign key checks temporarily to avoid issues with table dependencies
SET FOREIGN_KEY_CHECKS = 0;

-- Generate DELETE statements for all tables except '_migrations'
SELECT CONCAT('DELETE FROM `', table_name, '`;') AS delete_stmt
FROM information_schema.tables
WHERE table_schema = DATABASE()
AND table_name != '_prisma_migrations'
AND table_type = 'BASE TABLE';

-- Enable foreign key checks after deletion
SET FOREIGN_KEY_CHECKS = 1;
