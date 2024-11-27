import {
  mysqlTable,
  primaryKey,
  int,
  varchar,
  index,
  text,
  tinyint,
  timestamp,
  datetime,
  longtext,
  unique,
  tinytext,
  double,
  mediumtext,
  smallint,
  date,
  time,
  bigint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const adminSettings = mysqlTable(
  "admin_settings",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    description: varchar({ length: 50 }),
    value: varchar({ length: 50 }),
  },
  (table) => {
    return {
      adminSettingsId: primaryKey({
        columns: [table.id],
        name: "admin_settings_id",
      }),
    };
  },
);

export const approvalReport = mysqlTable(
  "approval_report",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    itemNo: varchar("item_no", { length: 20 }).notNull(),
    itemColorCode: varchar("item_color_code", { length: 10 }).notNull(),
    report: text().notNull(),
    status: tinyint().default(0).notNull(),
    creatorUserId: int("creator_user_id", { unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .default(sql`(now())`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string" })
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => {
    return {
      creatorUserId: index("creator_user_id").on(table.creatorUserId),
      approvalReportId: primaryKey({
        columns: [table.id],
        name: "approval_report_id",
      }),
    };
  },
);

export const approvalReportHasImage = mysqlTable(
  "approval_report_has_image",
  {
    approvalReportId: int("approval_report_id", { unsigned: true }).notNull(),
    base64Image: longtext("base64_image"),
  },
  (table) => {
    return {
      approvalReportId: index("approval_report_id").on(table.approvalReportId),
    };
  },
);

export const brand = mysqlTable(
  "brand",
  {
    no: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 30 }).notNull(),
    code: varchar({ length: 10 }).notNull(),
    gln: varchar({ length: 50 }).default("").notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      code: index("code").on(table.code),
      brandNo: primaryKey({ columns: [table.no], name: "brand_no" }),
    };
  },
);

export const carton = mysqlTable(
  "carton",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    type: tinytext().notNull(),
    length: double({ precision: 10, scale: 2 }),
    width: double({ precision: 10, scale: 2 }),
    height: double({ precision: 10, scale: 2 }),
    weight: double({ precision: 10, scale: 2 }),
    creatorUserId: int("creator_user_id").notNull(),
    vendorNo: varchar("vendor_no", { length: 20 }).notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      cartonId: primaryKey({ columns: [table.id], name: "carton_id" }),
      uniqueKey: unique("unique_key").on(
        table.length,
        table.width,
        table.height,
        table.weight,
        table.creatorUserId,
        table.vendorNo,
      ),
    };
  },
);

export const direction = mysqlTable(
  "direction",
  {
    id: int().notNull(),
    direction: varchar({ length: 30 }).notNull(),
  },
  (table) => {
    return {
      directionId: primaryKey({ columns: [table.id], name: "direction_id" }),
    };
  },
);

export const documentCategory = mysqlTable(
  "document_category",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    description: varchar({ length: 50 }).notNull(),
    documentType: int("document_type").notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => {
    return {
      fkDocType: index("fk_doc_type").on(table.documentType),
      documentCategoryId: primaryKey({
        columns: [table.id],
        name: "document_category_id",
      }),
    };
  },
);

export const documentTypes = mysqlTable(
  "document_types",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 30 }).notNull(),
  },
  (table) => {
    return {
      documentTypesId: primaryKey({
        columns: [table.id],
        name: "document_types_id",
      }),
      uniqueName: unique("unique_name").on(table.name),
    };
  },
);

export const downloaded = mysqlTable(
  "downloaded",
  {
    uploadId: int("upload_id").notNull(),
    downloadedBy: int("downloaded_by").notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow(),
  },
  (table) => {
    return {
      uploadId: index("upload_id").on(table.uploadId),
      by: index("downloaded_by").on(table.downloadedBy),
    };
  },
);

export const forecast = mysqlTable(
  "forecast",
  {
    id: int().autoincrement().notNull(),
    seasonCode: smallint("season_code").notNull().default(0),
    itemNo: varchar("item_no", { length: 20 })
      .notNull()
      .references(() => sItem.no),
    colorCode: varchar("color_code", { length: 10 }).notNull(),
    amount: int().notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .notNull(),
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

export const itemComment = mysqlTable(
  "item_comment",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    itemNo: varchar("item_no", { length: 20 }).notNull(),
    comment: mediumtext().notNull(),
    commentBy: int("comment_by", { unsigned: true }).notNull(),
    purchasingRole: int("purchasing_role", { unsigned: true }),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => {
    return {
      commentBy: index("comment_by").on(table.commentBy),
      purchasingRole: index("purchasing_role").on(table.purchasingRole),
      itemCommentId: primaryKey({
        columns: [table.id],
        name: "item_comment_id",
      }),
    };
  },
);

export const loadingList = mysqlTable(
  "loading_list",
  {
    id: int().autoincrement().notNull(),
    seasonCode: smallint("season_code"),
    status: smallint().notNull(),
    direction: int().default(0).notNull(),
    transportType: int("transport_type", { unsigned: true }).notNull(),
    containerCode: varchar("container_code", { length: 20 }),
    vendorNo: varchar("vendor_no", { length: 20 }),
    vendorReference: varchar("vendor_reference", { length: 50 }),
    vendorComment: mediumtext("vendor_comment"),
    creatorUserId: int("creator_user_id", { unsigned: true }),
    brandNo: varchar("brand_no", { length: 10 }),
    volume: int(),
    weight: int(),
    noCarton: int("no_carton"),
    qtyPairs: int("qty_pairs"),
    dateCreated: timestamp("date_created", { mode: "string" })
      .default(sql`(now())`)
      .notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    plannedDeliveryDate: date("planned_delivery_date", { mode: "string" }),
    plannedDeliveryTime: time("planned_delivery_time"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    realDeliveryDate: date("real_delivery_date", { mode: "string" }),
    realDeliveryTime: time("real_delivery_time"),
    realNoCartons: int("real_no_cartons"),
    noFaultCarton: int("no_fault_carton"),
    realDeliveryComment: mediumtext("real_delivery_comment"),
    purchaseRealDeliveryComment: text("purchase_real_delivery_comment"),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
    commercialInvoiceNo: varchar("commercial_invoice_no", { length: 50 }),
    waybill: varchar({ length: 255 }),
  },
  (table) => {
    return {
      ibfk1: index("loading_list_ibfk_1").on(table.vendorNo),
      ibfk2: index("loading_list_ibfk_2").on(table.brandNo),
      ibfk3: index("loading_list_ibfk_3").on(table.seasonCode),
      ibfk4: index("loading_list_ibfk_4").on(table.direction),
      ibfk5: index("loading_list_ibfk_5").on(table.creatorUserId),
      ibfk6: index("loading_list_ibfk_6").on(table.transportType),
      loadingListId: primaryKey({
        columns: [table.id],
        name: "loading_list_id",
      }),
    };
  },
);

export const loadingListCalendarTime = mysqlTable(
  "loading_list_calendar_time",
  {
    id: int({ unsigned: true }).notNull(),
    time: time(),
  },
);

export const loadingListComments = mysqlTable(
  "loading_list_comments",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    creatorUserId: int("creator_user_id"),
    loadingListId: int("loading_list_id"),
    userRole: text("user_role"),
    comment: text(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow(),
  },
  (table) => {
    return {
      loadingListCommentsId: primaryKey({
        columns: [table.id],
        name: "loading_list_comments_id",
      }),
    };
  },
);

export const loadingListDocument = mysqlTable(
  "loading_list_document",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    loadingListId: int("loading_list_id").notNull(),
    vendorNo: int("vendor_no"),
    creatorUserId: int("creator_user_id"),
    brandNo: varchar("brand_no", { length: 10 }),
    containerCode: varchar("container_code", { length: 20 }),
    file: varchar({ length: 80 }),
    documentLink: tinytext("document_link"),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      loadingListDocumentId: primaryKey({
        columns: [table.id],
        name: "loading_list_document_id",
      }),
    };
  },
);

export const loadingListLine = mysqlTable(
  "loading_list_line",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    loadingListId: int("loading_list_id").notNull(),
    creatorUserId: int("creator_user_id"),
    orderNo: varchar("order_no", { length: 20 }).notNull(),
    orderLineNo: int("order_line_no").notNull(),
    itemNo: varchar("item_no", { length: 20 }),
    colorCode: varchar("color_code", { length: 10 }),
    sizeAssortCode: varchar("size_assort_code", { length: 10 }),
    qtyPair: int("qty_pair"),
    sscc: varchar({ length: 18 }).default("0").notNull(),
    containerCode: varchar("container_code", { length: 20 }),
    cartonStatus: smallint("carton_status"),
    cartonType: smallint("carton_type"),
    cancellation: smallint(),
    dropShipment: int("drop_shipment"),
    loadingListDirection: smallint("loading_list_direction").notNull(),
  },
  (table) => {
    return {
      loadingListLineId: primaryKey({
        columns: [table.id],
        name: "loading_list_line_id",
      }),
    };
  },
);

export const loadingListReservedCalendarTime = mysqlTable(
  "loading_list_reserved_calendar_time",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    loadingListId: int("loading_list_id"),
    countryCode: varchar("country_code", { length: 20 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    date: date({ mode: "string" }),
    time: time(),
  },
  (table) => {
    return {
      loadingListId: index("loading_list_id").on(table.loadingListId),
      countryCode: index("country_code").on(table.countryCode),
      loadingListReservedCalendarTimeId: primaryKey({
        columns: [table.id],
        name: "loading_list_reserved_calendar_time_id",
      }),
    };
  },
);

export const loadingListSsccFile = mysqlTable(
  "loading_list_sscc_file",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    loadingListId: int("loading_list_id").notNull(),
    creatorUserId: int("creator_user_id"),
    vendorNo: int("vendor_no").notNull(),
    folder: varchar({ length: 60 }).notNull(),
    file: varchar({ length: 60 }),
    timestamp: timestamp({ mode: "string" }).default(sql`(now())`),
  },
  (table) => {
    return {
      loadingListSsccFileId: primaryKey({
        columns: [table.id],
        name: "loading_list_sscc_file_id",
      }),
    };
  },
);

export const menu = mysqlTable(
  "menu",
  {
    id: smallint({ unsigned: true }).autoincrement().notNull(),
    title: varchar({ length: 50 }).notNull(),
    link: varchar({ length: 200 }),
    parentId: smallint("parent_id", { unsigned: true }),
    priority: smallint().notNull(),
    help: tinyint({ unsigned: true }).default(0).notNull(),
    sales: smallint(),
  },
  (table) => {
    return {
      menuId: primaryKey({ columns: [table.id], name: "menu_id" }),
      title: unique("title").on(table.title),
    };
  },
);

export const menuHasPermission = mysqlTable(
  "menu_has_permission",
  {
    menuId: int("menu_id", { unsigned: true }).notNull(),
    permissionId: int("permission_id", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      permisionFk: index("permision___fk").on(table.permissionId),
      menuHasPermissionMenuIdPermissionId: primaryKey({
        columns: [table.menuId, table.permissionId],
        name: "menu_has_permission_menu_id_permission_id",
      }),
      menuHasPermissionMenuIdPermissionIdUindex: unique(
        "menu_has_permission_menu_id_permission_id_uindex",
      ).on(table.menuId, table.permissionId),
    };
  },
);

export const menuHasRole = mysqlTable(
  "menu_has_role",
  {
    menuId: smallint("menu_id", { unsigned: true }).notNull(),
    roleId: int("role_id", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      roleFk: index("role___fk").on(table.menuId),
      menuHasRoleMenuIdRoleId: primaryKey({
        columns: [table.menuId, table.roleId],
        name: "menu_has_role_menu_id_role_id",
      }),
      menuHasRoleMenuIdRoleIdUindex: unique(
        "menu_has_role_menu_id_role_id_uindex",
      ).on(table.menuId, table.roleId),
    };
  },
);

export const migrations = mysqlTable(
  "migrations",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    file: varchar({ length: 100 }),
    imported: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => {
    return {
      migrationsId: primaryKey({ columns: [table.id], name: "migrations_id" }),
      uqFile: unique("uq_file").on(table.file),
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

export const qualities = mysqlTable(
  "qualities",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 50 }).notNull(),
  },
  (table) => {
    return {
      qualitiesId: primaryKey({ columns: [table.id], name: "qualities_id" }),
    };
  },
);

export const returns = mysqlTable(
  "returns",
  {
    id: int().autoincrement().notNull(),
    avis: varchar({ length: 50 }).notNull(),
    customerReference: varchar("customer_reference", { length: 50 }).notNull(),
    qualityId: int("quality_id").notNull(),
    sscc: varchar({ length: 18 }),
    gtin: varchar({ length: 20 }),
    exported: tinyint().default(0).notNull(),
  },
  (table) => {
    return {
      fkQuality: index("fk_quality").on(table.qualityId),
      returnsId: primaryKey({ columns: [table.id], name: "returns_id" }),
    };
  },
);

export const role = mysqlTable(
  "role",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
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
    roleId: int("role_id", { unsigned: true }).notNull(),
    permissionId: int("permission_id", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      roleHasPermissionRoleIdPermissionIdUindex: unique(
        "role_has_permission_role_id_permission_id_uindex",
      ).on(table.roleId, table.permissionId),
    };
  },
);

export const sAssortment = mysqlTable(
  "s_assortment",
  {
    code: varchar({ length: 30 }).notNull(),
    sizeCode: varchar("size_code", { length: 10 }).notNull(),
    qtyPair: int("qty_pair").notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueKey: unique("unique_key").on(table.code, table.sizeCode),
    };
  },
);

export const sColor = mysqlTable(
  "s_color",
  {
    code: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 30 }),
    seasonCode: smallint("season_code").notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueKey: unique("unique_key").on(table.code, table.seasonCode),
    };
  },
);

export const sCountry = mysqlTable(
  "s_country",
  {
    code: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 30 }).notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
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

export const sCustomer = mysqlTable(
  "s_customer",
  {
    no: int().notNull(),
    name: varchar({ length: 255 }).notNull(),
    countryCode: varchar("country_code", { length: 3 }),
  },
  (table) => {
    return {
      sCustomerNo: primaryKey({ columns: [table.no], name: "s_customer_no" }),
    };
  },
);

export const sDeliveryAddress = mysqlTable(
  "s_delivery_address",
  {
    orderNo: varchar("order_no", { length: 20 }).notNull(),
    name: varchar({ length: 50 }),
    name2: varchar("name_2", { length: 50 }),
    address: varchar({ length: 50 }),
    address2: varchar("address_2", { length: 50 }),
    postCode: varchar("post_code", { length: 30 }),
    city: varchar({ length: 50 }),
    countryCode: varchar("country_code", { length: 10 }),
    yourReference: varchar("your_reference", { length: 50 }),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      sDeliveryAddressOrderNo: primaryKey({
        columns: [table.orderNo],
        name: "s_delivery_address_order_no",
      }),
    };
  },
);

export const sDownloadCenter = mysqlTable("s_download_center", {
  fileName: varchar("file_name", { length: 100 }).notNull(),
  seasonCode: smallint("season_code"),
  brandNo: varchar("brand_no", { length: 50 }),
  vendorNo: varchar("vendor_no", { length: 20 }),
  docType: smallint("doc_type"),
  downloadedFrom: int("downloaded_from"),
  downloadTime: timestamp("download_time", { mode: "string" }),
  uploadTime: timestamp("upload_time", { mode: "string" }),
  released: smallint(),
  timestamp: timestamp({ mode: "string" })
    .default(sql`(now())`)
    .onUpdateNow()
    .notNull(),
});

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
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
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
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueKey: unique("unique_key").on(table.itemNo, table.colorCode),
    };
  },
);

export const sPurchaseHead = mysqlTable(
  "s_purchase_head",
  {
    orderNo: varchar("order_no", { length: 20 }).notNull(),
    vendorNo: varchar("vendor_no", { length: 20 }).notNull(),
    reference: varchar({ length: 50 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    orderDate: date("order_date", { mode: "string" }).notNull(),
    customerNo: varchar("customer_no", { length: 20 }).notNull(),
    seasonCode: smallint("season_code").notNull(),
    brandNo: varchar("brand_no", { length: 10 }).notNull(),
    orderPhase: varchar("order_phase", { length: 10 }).notNull(),
    customerOrderNo: varchar("customer_order_no", { length: 30 }),
    status: varchar({ length: 20 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    requestDeliveryDate: date("request_delivery_date", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    releaseDate: date("release_date", { mode: "string" }),
    transportTypeId: smallint("transport_type_id"),
    directionId: smallint("direction_id"),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      sPurchaseHeadOrderNo: primaryKey({
        columns: [table.orderNo],
        name: "s_purchase_head_order_no",
      }),
    };
  },
);

export const sPurchaseLine = mysqlTable(
  "s_purchase_line",
  {
    id: int().autoincrement().notNull(),
    orderNo: varchar("order_no", { length: 20 }).notNull(),
    orderLineNo: int("order_line_no").notNull(),
    itemNo: varchar("item_no", { length: 20 }),
    colorCode: varchar("color_code", { length: 10 }),
    sizeAssortCode: varchar("size_assort_code", { length: 10 }),
    vendorNo: varchar("vendor_no", { length: 20 }),
    qty: int(),
    qtyPair: int("qty_pair"),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    requestedReceivedDate: date("requested_received_date", { mode: "string" }),
    last: varchar({ length: 30 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    promisedReceivedDate: date("promised_received_date", { mode: "string" }),
    countryOriginCode: varchar("country_origin_code", { length: 10 }),
    brandNo: varchar("brand_no", { length: 10 }),
    catName: varchar("cat_name", { length: 10 }),
    customerOrderNo: varchar("customer_order_no", { length: 30 }),
    customerColor: varchar("customer_color", { length: 20 }),
    directUnitCost: int("direct_unit_cost"),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      sizeAssortCode: index("size_assort_code").on(table.sizeAssortCode),
      sPurchaseLineId: primaryKey({
        columns: [table.id],
        name: "s_purchase_line_id",
      }),
      uniqueKey: unique("unique_key").on(table.orderNo, table.orderLineNo),
    };
  },
);

export const sSeason = mysqlTable(
  "s_season",
  {
    code: smallint().notNull(),
    name: varchar({ length: 50 }),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
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
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
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

export const sSize = mysqlTable("s_size", {
  code: varchar({ length: 10 }).notNull(),
  name: varchar({ length: 30 }),
  qtyPair: int("qty_pair").notNull(),
  timestamp: timestamp({ mode: "string" })
    .default(sql`(now())`)
    .onUpdateNow()
    .notNull(),
});

export const sStyle = mysqlTable(
  "s_style",
  {
    code: smallint().notNull(),
    description: varchar({ length: 50 }).notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      sStyleCode: primaryKey({ columns: [table.code], name: "s_style_code" }),
      sStyleDescriptionUindex: unique("s_style_description_uindex").on(
        table.description,
      ),
    };
  },
);

export const sVariant = mysqlTable(
  "s_variant",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    itemNo: varchar("item_no", { length: 20 }),
    colorCode: varchar("color_code", { length: 10 }),
    sizeCode: varchar("size_code", { length: 10 }),
    gtin: varchar({ length: 20 }),
    unitSalePrice: int("unit_sale_price"),
    repRetailPrice: int("rep_retail_price"),
    purchasePrice: int("purchase_price"),
    inactive: smallint({ unsigned: true }).notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      sVariantId: primaryKey({ columns: [table.id], name: "s_variant_id" }),
      uniqueKey: unique("unique_key").on(
        table.itemNo,
        table.colorCode,
        table.sizeCode,
      ),
    };
  },
);

export const sVendor = mysqlTable(
  "s_vendor",
  {
    no: varchar({ length: 20 }).notNull(),
    name: varchar({ length: 50 }),
    countryCode: varchar("country_code", { length: 5 }),
    originHarbor: varchar("origin_harbor", { length: 20 }),
    originHarborCountry: varchar("origin_harbor_country", { length: 20 }),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      sVendorNo: primaryKey({ columns: [table.no], name: "s_vendor_no" }),
    };
  },
);

export const shoeBox = mysqlTable(
  "shoe_box",
  {
    code: smallint({ unsigned: true }).autoincrement().notNull(),
    sex: tinytext().notNull(),
    length: double({ precision: 10, scale: 2 }),
    width: double({ precision: 10, scale: 2 }),
    height: double({ precision: 10, scale: 2 }),
    weight: double({ precision: 10, scale: 2 }),
    vendorNo: varchar("vendor_no", { length: 20 }).notNull(),
    creatorId: int("creator_id", { unsigned: true }).notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      shoeBoxCode: primaryKey({ columns: [table.code], name: "shoe_box_code" }),
      uniqueKey: unique("unique_key").on(
        table.length,
        table.width,
        table.height,
        table.weight,
        table.vendorNo,
      ),
    };
  },
);

export const sscc = mysqlTable(
  "sscc",
  {
    sscc: varchar({ length: 18 }).notNull(),
    batchIdentifier: varchar("batch_identifier", { length: 255 }).notNull(),
    serial: int().notNull(),
    loadingListId: int("loading_list_id"),
    orderNo: varchar("order_no", { length: 20 }).notNull(),
    purchaseLineId: int("purchase_line_id"),
    printed: smallint(),
    cartonType: smallint("carton_type").notNull(),
    cartonDescription: varchar("carton_description", { length: 20 }).notNull(),
    creatorUserId: smallint("creator_user_id", { unsigned: true }).notNull(),
    canceled: smallint(),
    weight: smallint(),
    updatedBy: int("updated_by"),
    updatedOn: timestamp("updated_on", { mode: "string" }).onUpdateNow(),
    cartonId: int("carton_id").notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => {
    return {
      ssccSscc: primaryKey({ columns: [table.sscc], name: "sscc_sscc" }),
    };
  },
);

export const ssccLine = mysqlTable(
  "sscc_line",
  {
    id: int().autoincrement().notNull(),
    sscc: varchar({ length: 18 }).default("0").notNull(),
    orderNo: varchar("order_no", { length: 20 }).notNull(),
    orderLineNo: int("order_line_no").notNull(),
    purchaseLineId: int("purchase_line_id").notNull(),
    qtyInCarton: int("qty_in_carton"),
    creatorUserId: int("creator_user_id").notNull(),
    updatedBy: int("updated_by"),
    canceled: smallint(),
    shoeBoxCode: smallint("shoe_box_code").notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      ssccLineId: primaryKey({ columns: [table.id], name: "sscc_line_id" }),
    };
  },
);

export const styleHasBox = mysqlTable(
  "style_has_box",
  {
    styleCode: smallint("style_code").notNull(),
    category: varchar({ length: 10 }).notNull(),
    shoeBoxCode: smallint("shoe_box_code", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      styleHasBoxStyleCodeCategory: primaryKey({
        columns: [table.styleCode, table.category],
        name: "style_has_box_style_code_category",
      }),
      styleHasBoxStyleCodeCategoryUindex: unique(
        "style_has_box_style_code_category_uindex",
      ).on(table.styleCode, table.category),
    };
  },
);

export const technicalReport = mysqlTable(
  "technical_report",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    itemNo: varchar("item_no", { length: 20 }).notNull(),
    report: mediumtext().notNull(),
    creatorUserId: int("creator_user_id", { unsigned: true }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => {
    return {
      creatorUserId: index("creator_user_id").on(table.creatorUserId),
      technicalReportId: primaryKey({
        columns: [table.id],
        name: "technical_report_id",
      }),
    };
  },
);

export const technicalReportHasImage = mysqlTable(
  "technical_report_has_image",
  {
    technicalReportId: int("technical_report_id", { unsigned: true }),
    base64Image: longtext("base64_image"),
  },
  (table) => {
    return {
      technicalReportId: index("technical_report_id").on(
        table.technicalReportId,
      ),
    };
  },
);

export const transportType = mysqlTable(
  "transport_type",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    name: varchar({ length: 20 }).notNull(),
  },
  (table) => {
    return {
      transportTypeId: primaryKey({
        columns: [table.id],
        name: "transport_type_id",
      }),
    };
  },
);

export const upload = mysqlTable(
  "upload",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    file: varchar({ length: 255 }).notNull(),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    type: varchar({ length: 30 }).notNull(),
    reference: varchar({ length: 50 }).notNull(),
    uploadedBy: int("uploaded_by").notNull(),
    seasonCode: smallint("season_code"),
    vendorNo: varchar("vendor_no", { length: 20 }),
    itemNo: varchar("item_no", { length: 20 }),
    colorCode: varchar("color_code", { length: 10 }),
    documentCatId: int("document_cat_id"),
    reference2: varchar("reference_2", { length: 50 }),
    reference3: varchar("reference_3", { length: 50 }),
    reference4: varchar("reference_4", { length: 50 }),
    comment: varchar({ length: 255 }),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .notNull(),
    customerNo: varchar("customer_no", { length: 20 }),
  },
  (table) => {
    return {
      uploadId: primaryKey({ columns: [table.id], name: "upload_id" }),
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
    userId: int("user_id", { unsigned: true }).notNull(),
    countryCode: varchar("country_code", { length: 10 }).notNull(),
  },
  (table) => {
    return {
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
    permissionId: int("permission_id", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      permissionFk: index("permission___fk").on(table.permissionId),
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
    userId: int("user_id", { unsigned: true }).notNull(),
    roleId: int("role_id", { unsigned: true }).notNull(),
  },
  (table) => {
    return {
      roleFk: index("role___fk").on(table.roleId),
      userHasRoleUserIdRoleId: primaryKey({
        columns: [table.userId, table.roleId],
        name: "user_has_role_user_id_role_id",
      }),
      userHasRoleUserIdRoleIdUindex: unique(
        "user_has_role_user_id_role_id_uindex",
      ).on(table.userId, table.roleId),
    };
  },
);

export const userHasVendor = mysqlTable(
  "user_has_vendor",
  {
    userId: int("user_id", { unsigned: true }).notNull(),
    vendorNo: varchar("vendor_no", { length: 20 }).notNull(),
  },
  (table) => {
    return {
      vendorFk: index("vendor__fk").on(table.vendorNo),
      userHasVendorUserIdVendorNo: primaryKey({
        columns: [table.userId, table.vendorNo],
        name: "user_has_vendor_user_id_vendor_no",
      }),
      userHasVendorUserIdVendorNoUindex: unique(
        "user_has_vendor_user_id_vendor_no_uindex",
      ).on(table.userId, table.vendorNo),
    };
  },
);

export const variantHasBox = mysqlTable("variant_has_box", {
  itemNo: int("item_no", { unsigned: true }),
  sizeCode: varchar("size_code", { length: 10 }),
  shoeBoxNo: smallint("shoe_box_no", { unsigned: true }),
});

export const variantWeight = mysqlTable(
  "variant_weight",
  {
    itemNo: varchar("item_no", { length: 20 }),
    sizeCode: varchar("size_code", { length: 10 }),
    weight: smallint({ unsigned: true }).notNull(),
    creatorUserId: smallint("creator_user_id", { unsigned: true }).notNull(),
    timestamp: timestamp({ mode: "string" })
      .default(sql`(now())`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueKey: unique("unique_key").on(
        table.weight,
        table.itemNo,
        table.sizeCode,
      ),
    };
  },
);
