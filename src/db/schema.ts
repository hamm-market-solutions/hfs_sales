import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, int, varchar, timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const permission = mysqlTable("permission", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	name: varchar({ length: 50 }).notNull(),
},
(table) => {
	return {
		permissionId: primaryKey({ columns: [table.id], name: "permission_id"}),
		permissionNameUindex: unique("permission_name_uindex").on(table.name),
	}
});

export const user = mysqlTable("user", {
	id: int({ unsigned: true }).autoincrement().notNull(),
	fname: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	password: varchar({ length: 70 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	passwordcode: varchar({ length: 255 }),
	passwordcodeTime: timestamp("passwordcode_time", { mode: 'string' }),
},
(table) => {
	return {
		userId: primaryKey({ columns: [table.id], name: "user_id"}),
		userEmailUindex: unique("user_email_uindex").on(table.email),
	}
});
