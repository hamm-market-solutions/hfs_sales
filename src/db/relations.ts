import { relations } from "drizzle-orm/relations";
import { user, approvalReport, approvalReportHasImage, documentTypes, documentCategory, sCountry, forecast, sItem, itemComment, role, sVendor, loadingList, brand, sSeason, direction, transportType, loadingListReservedCalendarTime, permission, menuHasPermission, menu, menuHasRole, qualities, returns, technicalReport, technicalReportHasImage, userHasPermission, userHasRole, userHasVendor } from "./schema";

export const approvalReportRelations = relations(approvalReport, ({one, many}) => ({
    user: one(user, {
        fields: [approvalReport.creatorUserId],
        references: [user.id]
    }),
    approvalReportHasImages: many(approvalReportHasImage),
}));

export const userRelations = relations(user, ({many}) => ({
    approvalReports: many(approvalReport),
    forecasts: many(forecast),
    itemComments: many(itemComment),
    loadingLists: many(loadingList),
    technicalReports: many(technicalReport),
    userHasRoles: many(userHasRole),
    userHasVendors: many(userHasVendor),
}));

export const approvalReportHasImageRelations = relations(approvalReportHasImage, ({one}) => ({
    approvalReport: one(approvalReport, {
        fields: [approvalReportHasImage.approvalReportId],
        references: [approvalReport.id]
    }),
}));

export const documentCategoryRelations = relations(documentCategory, ({one}) => ({
    documentType: one(documentTypes, {
        fields: [documentCategory.documentType],
        references: [documentTypes.id]
    }),
}));

export const documentTypesRelations = relations(documentTypes, ({many}) => ({
    documentCategories: many(documentCategory),
}));

export const forecastRelations = relations(forecast, ({one}) => ({
    sCountry: one(sCountry, {
        fields: [forecast.countryCode],
        references: [sCountry.code]
    }),
    user: one(user, {
        fields: [forecast.createdBy],
        references: [user.id]
    }),
    sItem: one(sItem, {
        fields: [forecast.itemNo],
        references: [sItem.no]
    }),
}));

export const sCountryRelations = relations(sCountry, ({many}) => ({
    forecasts: many(forecast),
    loadingListReservedCalendarTimes: many(loadingListReservedCalendarTime),
}));

export const sItemRelations = relations(sItem, ({one, many}) => ({
    forecasts: many(forecast),
    brand: one(brand, {
        fields: [sItem.brandNo],
        references: [brand.no]
    }),
}));

export const itemCommentRelations = relations(itemComment, ({one}) => ({
    user: one(user, {
        fields: [itemComment.commentBy],
        references: [user.id]
    }),
    role: one(role, {
        fields: [itemComment.purchasingRole],
        references: [role.id]
    }),
}));

export const roleRelations = relations(role, ({many}) => ({
    itemComments: many(itemComment),
}));

export const loadingListRelations = relations(loadingList, ({one, many}) => ({
    sVendor: one(sVendor, {
        fields: [loadingList.vendorNo],
        references: [sVendor.no]
    }),
    brand: one(brand, {
        fields: [loadingList.brandNo],
        references: [brand.no]
    }),
    sSeason: one(sSeason, {
        fields: [loadingList.seasonCode],
        references: [sSeason.code]
    }),
    direction: one(direction, {
        fields: [loadingList.direction],
        references: [direction.id]
    }),
    user: one(user, {
        fields: [loadingList.creatorUserId],
        references: [user.id]
    }),
    transportType: one(transportType, {
        fields: [loadingList.transportType],
        references: [transportType.id]
    }),
    loadingListReservedCalendarTimes: many(loadingListReservedCalendarTime),
}));

export const sVendorRelations = relations(sVendor, ({many}) => ({
    loadingLists: many(loadingList),
}));

export const brandRelations = relations(brand, ({many}) => ({
    loadingLists: many(loadingList),
    sItems: many(sItem),
}));

export const sSeasonRelations = relations(sSeason, ({many}) => ({
    loadingLists: many(loadingList),
}));

export const directionRelations = relations(direction, ({many}) => ({
    loadingLists: many(loadingList),
}));

export const transportTypeRelations = relations(transportType, ({many}) => ({
    loadingLists: many(loadingList),
}));

export const loadingListReservedCalendarTimeRelations = relations(loadingListReservedCalendarTime, ({one}) => ({
    loadingList: one(loadingList, {
        fields: [loadingListReservedCalendarTime.loadingListId],
        references: [loadingList.id]
    }),
    sCountry: one(sCountry, {
        fields: [loadingListReservedCalendarTime.countryCode],
        references: [sCountry.code]
    }),
}));

export const menuHasPermissionRelations = relations(menuHasPermission, ({one}) => ({
    permission: one(permission, {
        fields: [menuHasPermission.permissionId],
        references: [permission.id]
    }),
}));

export const permissionRelations = relations(permission, ({many}) => ({
    menuHasPermissions: many(menuHasPermission),
    userHasPermissions: many(userHasPermission),
}));

export const menuHasRoleRelations = relations(menuHasRole, ({one}) => ({
    menu: one(menu, {
        fields: [menuHasRole.menuId],
        references: [menu.id]
    }),
}));

export const menuRelations = relations(menu, ({many}) => ({
    menuHasRoles: many(menuHasRole),
}));

export const returnsRelations = relations(returns, ({one}) => ({
    quality: one(qualities, {
        fields: [returns.qualityId],
        references: [qualities.id]
    }),
}));

export const qualitiesRelations = relations(qualities, ({many}) => ({
    returns: many(returns),
}));

export const technicalReportRelations = relations(technicalReport, ({one, many}) => ({
    user: one(user, {
        fields: [technicalReport.creatorUserId],
        references: [user.id]
    }),
    technicalReportHasImages: many(technicalReportHasImage),
}));

export const technicalReportHasImageRelations = relations(technicalReportHasImage, ({one}) => ({
    technicalReport: one(technicalReport, {
        fields: [technicalReportHasImage.technicalReportId],
        references: [technicalReport.id]
    }),
}));

export const userHasPermissionRelations = relations(userHasPermission, ({one}) => ({
    permission: one(permission, {
        fields: [userHasPermission.permissionId],
        references: [permission.id]
    }),
}));

export const userHasRoleRelations = relations(userHasRole, ({one}) => ({
    user: one(user, {
        fields: [userHasRole.userId],
        references: [user.id]
    }),
}));

export const userHasVendorRelations = relations(userHasVendor, ({one}) => ({
    user: one(user, {
        fields: [userHasVendor.userId],
        references: [user.id]
    }),
}));