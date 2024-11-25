import { relations } from "drizzle-orm/relations";

import { sCountry, forecast, user, sItem, brand } from "./schema";

export const forecastRelations = relations(forecast, ({ one }) => ({
  sCountry: one(sCountry, {
    fields: [forecast.countryCode],
    references: [sCountry.code],
  }),
  user: one(user, {
    fields: [forecast.createdBy],
    references: [user.id],
  }),
  sItem: one(sItem, {
    fields: [forecast.itemNo],
    references: [sItem.no],
  }),
}));

export const sCountryRelations = relations(sCountry, ({ many }) => ({
  forecasts: many(forecast),
}));

export const userRelations = relations(user, ({ many }) => ({
  forecasts: many(forecast),
}));

export const sItemRelations = relations(sItem, ({ one, many }) => ({
  forecasts: many(forecast),
  brand: one(brand, {
    fields: [sItem.brandNo],
    references: [brand.no],
  }),
}));

export const brandRelations = relations(brand, ({ many }) => ({
  sItems: many(sItem),
}));
