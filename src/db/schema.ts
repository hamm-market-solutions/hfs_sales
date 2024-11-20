import {
  mysqlTable,
  index,
  primaryKey,
  varchar,
  timestamp,
  int,
  unique,
  smallint,
  bigint,
  date,
} from "drizzle-orm/mysql-core";

export const brand = mysqlTable(
  "brand",
  {
    no: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 30 }).notNull(),
    code: varchar({ length: 10 }).notNull(),
    gln: varchar({ length: 50 }).default("").notNull(),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      code: index("code").on(table.code),
      brandNo: primaryKey({ columns: [table.no], name: "brand_no" }),
    };
  },
);

export const forecast = mysqlTable(
  "forecast",
  {
    id: int().autoincrement().notNull(),
    itemNo: varchar("item_no", { length: 20 })
      .notNull()
      .references(() => sItem.no),
    colorCode: varchar("color_code", { length: 10 }).notNull(),
    amount: int().notNull(),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
    countryCode: varchar("country_code", { length: 10 })
      .notNull()
      .references(() => sCountry.code),
    createdBy: int("created_by", { unsigned: true })
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      itemNo: index("item_no").on(table.itemNo),
      createdBy: index("created_by").on(table.createdBy),
      countryCode: index("country_code").on(table.countryCode),
      forecastId: primaryKey({ columns: [table.id], name: "forecast_id" }),
    };
  },
);

export const permission = mysqlTable(
  "permission",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    name: varchar({ length: 50 }).notNull(),
  },
  (table) => {
    return {
      permissionId: primaryKey({ columns: [table.id], name: "permission_id" }),
      permissionNameUindex: unique("permission_name_uindex").on(table.name),
    };
  },
);

export const role = mysqlTable(
  "role",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 50 }),
  },
  (table) => {
    return {
      roleId: primaryKey({ columns: [table.id], name: "role_id" }),
      roleNameUindex: unique("role_name_uindex").on(table.name),
    };
  },
);

export const roleHasPermission = mysqlTable(
  "role_has_permission",
  {
    roleId: int("role_id").notNull(),
    permissionId: int("permission_id", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      permissionId: index("permission_id").on(table.permissionId),
      roleHasPermissionRoleIdPermissionIdUindex: unique(
        "role_has_permission_role_id_permission_id_uindex",
      ).on(table.roleId, table.permissionId),
    };
  },
);

export const sCountry = mysqlTable(
  "s_country",
  {
    code: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 30 }).notNull(),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      sCountryCode: primaryKey({
        columns: [table.code],
        name: "s_country_code",
      }),
    };
  },
);

export const sItem = mysqlTable(
  "s_item",
  {
    no: varchar({ length: 20 }).notNull(),
    description: varchar({ length: 50 }),
    last: varchar({ length: 30 }),
    material: varchar({ length: 30 }),
    brandNo: varchar("brand_no", { length: 10 }).references(() => brand.no),
    catName: varchar("cat_name", { length: 10 }),
    orderQty: int("order_qty"),
    minQtyStyle: int("min_qty_style"),
    minQtyLast: int("min_qty_last"),
    seasonCode: smallint("season_code"),
    nos: smallint(),
    vendorNo: varchar("vendor_no", { length: 20 }),
    vendorItemNo: varchar("vendor_item_no", { length: 20 }),
    styleCode: smallint("style_code"),
    tariffNo: bigint("tariff_no", { mode: "number" }),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      brandNo: index("brand_no").on(table.brandNo),
      sItemNo: primaryKey({ columns: [table.no], name: "s_item_no" }),
    };
  },
);

export const sItemColor = mysqlTable(
  "s_item_color",
  {
    itemNo: varchar("item_no", { length: 20 }).notNull(),
    colorCode: varchar("color_code", { length: 10 }).notNull(),
    customColor: varchar("custom_color", { length: 30 }),
    purchasePrice: int("purchase_price"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    requestedExFactoryDate: date("requested_ex_factory_date", {
      mode: "string",
    }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    firstCustomerShipmentDate: date("first_customer_shipment_date", {
      mode: "string",
    }),
    priceConfirmed: int("price_confirmed"),
    preCollection: smallint("pre_collection").notNull(),
    mainCollection: smallint("main_collection").notNull(),
    lateCollection: smallint("late_collection").notNull(),
    specialCollection: smallint("Special_collection").notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    confirmedExFactoryDate: date("confirmed_ex_factory_date", {
      mode: "string",
    }),
    confirmationSampleSent: smallint("confirmation_sample_sent"),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueKey: unique("unique_key").on(table.itemNo, table.colorCode),
    };
  },
);

export const sSeason = mysqlTable(
  "s_season",
  {
    code: smallint().notNull(),
    name: varchar({ length: 50 }),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      sSeasonCode: primaryKey({ columns: [table.code], name: "s_season_code" }),
    };
  },
);

export const sSeasonBrandPhase = mysqlTable(
  "s_season_brand_phase",
  {
    seasonCode: smallint("season_code").notNull(),
    brandNo: varchar("brand_no", { length: 50 }),
    phase: smallint(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    startDate: date("start_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    endDate: date("end_date", { mode: "string" }),
    timestamp: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueKey: unique("unique_key").on(
        table.seasonCode,
        table.brandNo,
        table.phase,
      ),
    };
  },
);

export const user = mysqlTable(
  "user",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    fname: varchar({ length: 50 }).notNull(),
    name: varchar({ length: 50 }).notNull(),
    password: varchar({ length: 70 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
    passwordcode: varchar({ length: 255 }),
    passwordcodeTime: timestamp("passwordcode_time", { mode: "string" }),
  },
  (table) => {
    return {
      userId: primaryKey({ columns: [table.id], name: "user_id" }),
      userEmailUindex: unique("user_email_uindex").on(table.email),
    };
  },
);

export const userHasCountry = mysqlTable(
  "user_has_country",
  {
    userId: int("user_id", { unsigned: true })
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    countryCode: varchar("country_code", { length: 10 })
      .notNull()
      .references(() => sCountry.code, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      countryCode: index("country_code").on(table.countryCode),
      userHasCountryUserIdCountryCode: primaryKey({
        columns: [table.userId, table.countryCode],
        name: "user_has_country_user_id_country_code",
      }),
      userHasCountryUserIdCountryCodeUindex: unique(
        "user_has_country_user_id_country_code_uindex",
      ).on(table.userId, table.countryCode),
    };
  },
);

export const userHasPermission = mysqlTable(
  "user_has_permission",
  {
    userId: int("user_id", { unsigned: true }).notNull(),
    permissionId: int("permission_id", { unsigned: true })
      .notNull()
      .references(() => permission.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),
  },
  (table) => {
    return {
      userHasPermissionUserIdPermissionId: primaryKey({
        columns: [table.userId, table.permissionId],
        name: "user_has_permission_user_id_permission_id",
      }),
      userHasPermissionUserIdPermissionIdUindex: unique(
        "user_has_permission_user_id_permission_id_uindex",
      ).on(table.userId, table.permissionId),
    };
  },
);

export const userHasRole = mysqlTable(
  "user_has_role",
  {
    userId: int("user_id").notNull(),
    roleId: int("role_id")
      .notNull()
      .references(() => role.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      ibfk2: index("user_has_role_ibfk_2").on(table.roleId),
      userHasRoleUserIdRoleIdUindex: unique(
        "user_has_role_user_id_role_id_uindex",
      ).on(table.userId, table.roleId),
    };
  },
);
