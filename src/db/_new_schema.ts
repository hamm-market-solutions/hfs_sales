import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, int, varchar, index, foreignKey, text, tinyint, timestamp, datetime, longtext, unique, tinytext, double, mediumtext, smallint, date, time, bigint, serial } from "drizzle-orm/mysql-core"
import { desc, sql } from "drizzle-orm"
import { code } from "@nextui-org/theme";
import * as t from "drizzle-orm/mysql-core";
import { table } from "console";

// HFS BASE TABLES - tables that are pre filled with data

export const brands = mysqlTable("brands", {
	id: serial().primaryKey(),
	name: varchar({ length: 50 }).notNull(),
	code: varchar({ length: 10 }).notNull(),
	gln: varchar({ length: 13 }).notNull(),
});

export const directions = mysqlTable("directions", {
	id: serial().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
});

export const documentTypes = mysqlTable("document_types", {
	id: serial().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
});

export const documentCategories = mysqlTable("document_categories", {
	id: serial().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	documentType: int("document_type").references(() => documentTypes.id),
});

export const roles = mysqlTable("roles", {
	id: serial().primaryKey(),
	name: varchar({ length: 50 }).notNull().unique(),
	description: varchar({ length: 255 }),
});

export const permissions = mysqlTable("permissions", {
	id: serial().primaryKey(),
	name: varchar({ length: 50 }).notNull().unique(),
});

// HFS TABLES - tables that are filled with data by the application

export const users = mysqlTable("users", {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	fname: varchar({ length: 255 }),
	email: varchar({ length: 255 }).unique().notNull(),
	passwort: varchar({ length: 255 }).notNull(),
	passwordResetToken: varchar("password_reset_token", { length: 255 }),
	passwordResetExpires: datetime("password_reset_expires"),
});

export const userHasRoles = mysqlTable(
	"user_has_roles",
	{
		id: serial().primaryKey(),
		user: int("user_id").references(() => users.id),
		role: int("role_id").references(() => roles.id),
	},
	(table) => {
		return {
			userRoleUnique: t.uniqueIndex("user_role_unique").on(table.user, table.role),
		};
	}
);

export const userHasPermissions = mysqlTable(
	"user_has_permissions",
	{
		id: serial().primaryKey(),
		user: int("user_id").references(() => users.id),
		permission: int("permission_id").references(() => permissions.id),
	},
	(table) => {
		return {
			userPermissionUnique: t.uniqueIndex("user_permission_unique").on(table.user, table.permission),
		};
	}
);

// NAV TABLES - tables that are imported from navision

export const assortments = mysqlTable(
	"n_assortments",
	{
		id: serial().primaryKey(),
		code: varchar({ length: 30 }).notNull(),
		sizeCode: varchar({ length: 10 }),
		qtyPair: int("qty_pair").notNull(),
		timestamp: timestamp().notNull().defaultNow(),
	},
	(table) => {
		return {
			assortmentUnique: t.uniqueIndex("assortment_unique").on(table.code, table.sizeCode),
		};
	}
);

export const countries = mysqlTable("n_countries", {
	id: serial().primaryKey(),
	code: varchar({ length: 2 }).notNull().unique(),
	name: varchar({ length: 100 }).notNull(),
	timestamp: timestamp().notNull().defaultNow(),
});

export const customers = mysqlTable("n_customers", {
	id: serial().primaryKey(),
	no: int().notNull().unique(),
	name: varchar({ length: 255 }).notNull(),
	countryId: int("country_id").references(() => countries.id),
	timestamp: timestamp().notNull().defaultNow(),
});

export const color = mysqlTable("n_colors", {
	id: serial().primaryKey(),
	code: varchar({ length: 10 }).notNull().unique(),
	name: varchar({ length: 50 }).notNull(),
	seasonCode: smallint("season_code").notNull(),
	timestamp: timestamp().notNull().defaultNow(),
});

export const items = mysqlTable(
	"n_items",
	{
		id: serial().primaryKey(),
		no: varchar({ length: 20 }).notNull().unique(),
		description: varchar({ length: 100 }),
		last: varchar({ length: 30 }),
		material: varchar({ length: 30 }),
		brandId: int("brand_id").references(() => brands.id),
		category: varchar({ length: 10 }),
		qty: int(),
		minQtyStyle: int("min_qty_style"),
		minQtyLast: int("min_qty_last"),
		seasonId: smallint("season_id"),
		nos: smallint().default(0),
		vendorId: int("vendor_id"),
		vendorItemNo: varchar("vendor_item_no", { length: 20 }),
		styleId: int("style_id"),
		tariffNo: bigint("tariff_no", { mode: "number" }),
		timestamp: timestamp().notNull().defaultNow(),
	}
);
