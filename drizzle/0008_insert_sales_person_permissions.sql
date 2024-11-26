INSERT INTO `permission` (`id`, `name`) VALUES (69, 'forecast.view');--> statement-breakpoint
INSERT INTO `permission` (`id`, `name`) VALUES (70, 'forecast.add');--> statement-breakpoint
INSERT INTO `permission` (`id`, `name`) VALUES (71, 'forecast.delete');--> statement-breakpoint
INSERT INTO `permission` (`id`, `name`) VALUES (72, 'forecast.export');
--> statement-breakpoint
INSERT INTO `role_has_permission` (`role_id`, `permission_id`) VALUES
    (12, 69),
    (12, 72),
    (16, 69),
    (16, 70);