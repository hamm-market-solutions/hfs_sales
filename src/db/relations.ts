import { relations } from "drizzle-orm/relations";
import { sItem, forecast, user, sCountry, brand, sItemColor, userHasCountry, permission, userHasPermission, role, userHasRole } from "./schema";

export const forecastRelations = relations(forecast, ({one}) => ({
	sItem: one(sItem, {
		fields: [forecast.itemNo],
		references: [sItem.no]
	}),
	user: one(user, {
		fields: [forecast.createdBy],
		references: [user.id]
	}),
	sCountry: one(sCountry, {
		fields: [forecast.countryCode],
		references: [sCountry.code]
	}),
}));

export const sItemRelations = relations(sItem, ({one, many}) => ({
	forecasts: many(forecast),
	brand: one(brand, {
		fields: [sItem.brandNo],
		references: [brand.no]
	}),
	sItemColors: many(sItemColor),
}));

export const userRelations = relations(user, ({many}) => ({
	forecasts: many(forecast),
	userHasCountries: many(userHasCountry),
}));

export const sCountryRelations = relations(sCountry, ({many}) => ({
	forecasts: many(forecast),
	userHasCountries: many(userHasCountry),
}));

export const brandRelations = relations(brand, ({many}) => ({
	sItems: many(sItem),
}));

export const sItemColorRelations = relations(sItemColor, ({one}) => ({
	sItem: one(sItem, {
		fields: [sItemColor.itemNo],
		references: [sItem.no]
	}),
}));

export const userHasCountryRelations = relations(userHasCountry, ({one}) => ({
	user: one(user, {
		fields: [userHasCountry.userId],
		references: [user.id]
	}),
	sCountry: one(sCountry, {
		fields: [userHasCountry.countryCode],
		references: [sCountry.code]
	}),
}));

export const userHasPermissionRelations = relations(userHasPermission, ({one}) => ({
	permission: one(permission, {
		fields: [userHasPermission.permissionId],
		references: [permission.id]
	}),
}));

export const permissionRelations = relations(permission, ({many}) => ({
	userHasPermissions: many(userHasPermission),
}));

export const userHasRoleRelations = relations(userHasRole, ({one}) => ({
	role: one(role, {
		fields: [userHasRole.roleId],
		references: [role.id]
	}),
}));

export const roleRelations = relations(role, ({many}) => ({
	userHasRoles: many(userHasRole),
}));