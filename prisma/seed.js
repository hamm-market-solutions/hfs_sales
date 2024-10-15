import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await seedUserTable();
  await seedRoleTable();
  await seedPermissionTable();
  await seedRoleHasPermissionTable();
  await seedSeasonTable();
  await seedCountryTable();
  await seedBrandTable();
  await seedSeasonBrandPhaseTable();
  await seedUserHasCountryTable();
}

async function seedUserHasCountryTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO user_has_country (user_id,country_code) VALUES
      (1,'DE');
  `;

  console.log({ result });
}


async function seedSeasonBrandPhaseTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO s_season_brand_phase (season_code,brand_no,phase,start_date,end_date) VALUES
      (31,'3',9,'2024-11-04','2025-03-18'),
      (31,'3',6,'2025-02-13','2025-03-18'),
      (31,'3',5,'2025-01-03','2025-02-12'),
      (31,'3',4,'2024-11-04','2024-12-12'),
      (30,'3',9,'2024-06-17','2024-09-23'),
      (30,'3',6,'2024-08-19','2024-09-23'),
      (30,'3',5,'2024-06-17','2024-08-18'),
      (30,'3',4,'2024-06-17','2024-08-18');
  `;

  console.log({ result });
}

async function seedBrandTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO brand (no,name,code,gln) VALUES
	    ('3','Gant','HF','4056734');
  `;

  console.log({ result });
}

async function seedUserTable() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@hfs.com" },
    update: {},
    create: {
      email: "admin@hfs.com",
      fname: "HFS",
      name: "Admin",
      password: "$2a$10$ScRf6ODeuuIJW/F0XN3GlejAZN17U6Fd4XmFLxRtTd3CdZtjbZHbu", // Test1234.
    },
  });
  const sales = await prisma.user.upsert({
    where: { email: "sales@hfs.com" },
    update: {},
    create: {
      email: "sales@hfs.com",
      fname: "HFS",
      name: "Sales",
      password: "$2a$10$ScRf6ODeuuIJW/F0XN3GlejAZN17U6Fd4XmFLxRtTd3CdZtjbZHbu", // Test1234.
    },
  });
  const salesPerson = await prisma.user.upsert({
    where: { email: "salesperson@hfs.com" },
    update: {},
    create: {
      email: "salesperson@hfs.com",
      fname: "HFS",
      name: "SalesPerson",
      password: "$2a$10$ScRf6ODeuuIJW/F0XN3GlejAZN17U6Fd4XmFLxRtTd3CdZtjbZHbu", // Test1234.
    },
  });
}

async function seedRoleTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO role (id,name,description) VALUES
      (1,'super_admin',NULL),
      (2,'admin','admin'),
      (3,'developer',NULL),
      (4,'ceo','Chief Executive Officer'),
      (5,'purchasing',NULL),
      (6,'warehouse',NULL),
      (7,'supplier','Vendor'),
      (8,'logistic',NULL),
      (9,'qc','Quality controller'),
      (10,'qc_supplier',NULL),
      (11,'designer',NULL),
      (12,'sale',NULL),
      (13,'pm','Product manager'),
      (14,'intern_technical',NULL),
      (15,'marketing','Distribution');
  `;

  console.log({ result });
}

async function seedCountryTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO s_country (code,name) VALUES
      ('AD','Andorra'),
      ('AE','United Arab Emirates'),
      ('AL','Albanien'),
      ('AM','Armenien'),
      ('AT','Österreich'),
      ('AU','Australien'),
      ('AZ','Aserbaidschan'),
      ('BA','Bosnien-Herzegowina'),
      ('BE','Belgien'),
      ('BG','Bulgarien'),
      ('BH','Bahrain'),
      ('BN','Brunei Darussalam'),
      ('BR','Brasilien'),
      ('BS','Bahamas'),
      ('CA','Kanada'),
      ('CG','Republik Kongo'),
      ('CH','Schweiz'),
      ('CN','China'),
      ('CY','Zypern'),
      ('CZ','Czech Republic'),
      ('DE','Deutschland'),
      ('DK','Dänemark'),
      ('DO','Dominikanische Republik'),
      ('DZ','Algerien'),
      ('EE','Estland'),
      ('EG','Ägypten'),
      ('ES','Spanien'),
      ('FI','Finnland'),
      ('FJ','Fidschiinseln'),
      ('FR','Frankreich'),
      ('GB','Großbritannien'),
      ('GE','Georgien'),
      ('GR','Griechenland'),
      ('HK','Hongkong'),
      ('HR','Kroatien'),
      ('HU','Ungarn'),
      ('ID','Indonesien'),
      ('IE','Irland'),
      ('IL','Israel'),
      ('IN','Indien'),
      ('IS','Island'),
      ('IT','Italien'),
      ('JE','Jersey'),
      ('JP','Japan'),
      ('KE','Kenia'),
      ('KH','Kambodscha'),
      ('KR','Südkorea'),
      ('KW','Kuwait'),
      ('KZ','Kazakhstan'),
      ('LB','Libanon'),
      ('LI','Liechtenstein'),
      ('LT','Litauen'),
      ('LU','Luxemburg'),
      ('LV','Lettland'),
      ('LY','Lybien'),
      ('MA','Marokko'),
      ('MC','Monaco'),
      ('MD','Moldawien'),
      ('ME','Montenegro'),
      ('MG','Madagaskar'),
      ('MK','Nordmazedonien'),
      ('MQ','Martinique'),
      ('MT','Malta'),
      ('MU','Mauritius'),
      ('MX','Mexiko'),
      ('MY','Malaysia'),
      ('MZ','Mosambik'),
      ('NG','Nigeria'),
      ('NL','Niederlande'),
      ('NO','Norwegen'),
      ('NZ','Neuseeland'),
      ('PH','Philippinen'),
      ('PL','Polen'),
      ('PT','Portugal'),
      ('QA','Qatar'),
      ('RE','Reunion'),
      ('RO','Rumänien'),
      ('RU','Russland'),
      ('SA','Saudi Arabia'),
      ('SB','Salomonen'),
      ('SE','Schweden'),
      ('SG','Singapur'),
      ('SGP','Singapore'),
      ('SI','Slowenien'),
      ('SK','Slowakei'),
      ('SZ','Swasiland'),
      ('TH','Thailand'),
      ('TN','Tunesien'),
      ('TR','Türkei'),
      ('TW','Taiwan'),
      ('TZ','Tansania'),
      ('UA','Ukraine'),
      ('UG','Uganda'),
      ('US','USA'),
      ('VN','Vietnam'),
      ('VU','Vanuatu'),
      ('WS','Samoa'),
      ('XI','Nordirland'),
      ('XK','Republic of Kosovo'),
      ('XS','Serbien'),
      ('ZA','Südafrika');
  `;

  console.log({ result });
}

async function seedPermissionTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO permission (id,name) VALUES
      (56,'approval.add'),
      (57,'approval.delete'),
      (59,'approval.export'),
      (58,'approval.view'),
      (13,'carton.add'),
      (14,'carton.delete'),
      (12,'carton.view'),
      (60,'cartonLabel.export'),
      (68,'cleanUp'),
      (32,'comment.add'),
      (33,'comment.delete'),
      (31,'comment.view'),
      (23,'download.delivery'),
      (24,'download.general'),
      (26,'download.label'),
      (50,'download.loadingList'),
      (25,'download.order'),
      (27,'download.other'),
      (1,'item.view'),
      (4,'itemColor.view'),
      (5,'itemDetail.add'),
      (6,'itemDetail.delete'),
      (29,'loadingList.add'),
      (46,'loadingList.approve'),
      (48,'loadingList.cancel'),
      (30,'loadingList.delete'),
      (47,'loadingList.export'),
      (28,'loadingList.view'),
      (41,'menu.add'),
      (42,'menu.delete'),
      (44,'menu.setPermission'),
      (43,'menu.setRole'),
      (45,'menu.setVendor'),
      (40,'menu.view'),
      (7,'order.view'),
      (63,'returns.add'),
      (65,'returns.delete'),
      (67,'returns.export'),
      (66,'returns.view'),
      (16,'shoeBox.add'),
      (17,'shoeBox.delete'),
      (15,'shoeBox.view'),
      (10,'sscc.add'),
      (11,'sscc.delete'),
      (2,'sscc.export'),
      (9,'sscc.view'),
      (8,'supplier.view'),
      (52,'technical.add'),
      (53,'technical.delete'),
      (55,'technical.export'),
      (54,'technical.view'),
      (18,'upload.delivery'),
      (19,'upload.general'),
      (21,'upload.label'),
      (49,'upload.loadingList'),
      (20,'upload.order'),
      (22,'upload.other'),
      (62,'upload.supplierCertificate'),
      (61,'upload.testReport'),
      (35,'user.add'),
      (36,'user.delete'),
      (51,'user.resetPass'),
      (38,'user.setPermission'),
      (37,'user.setRole'),
      (39,'user.setVendor'),
      (34,'user.view');
  `;

  console.log({ result });
}

async function seedRoleHasPermissionTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO role_has_permission (role_id,permission_id) VALUES
      (5,1),
      (5,2),
      (5,4),
      (5,5),
      (5,6),
      (5,7),
      (5,8),
      (5,9),
      (5,10),
      (5,11),
      (5,12),
      (5,13),
      (5,14),
      (5,15),
      (5,16),
      (5,17),
      (5,18),
      (5,19),
      (5,20),
      (5,21),
      (5,22),
      (5,23),
      (5,24),
      (5,25),
      (5,26),
      (5,27),
      (5,28),
      (5,29),
      (5,30),
      (5,31),
      (5,32),
      (5,33),
      (5,34),
      (5,35),
      (5,37),
      (5,39),
      (5,46),
      (5,47),
      (5,48),
      (5,49),
      (5,50),
      (5,51),
      (5,52),
      (5,53),
      (5,54),
      (5,55),
      (5,56),
      (5,57),
      (5,58),
      (5,59),
      (5,61),
      (5,62),
      (7,1),
      (7,2),
      (7,4),
      (7,5),
      (7,6),
      (7,7),
      (7,9),
      (7,10),
      (7,12),
      (7,13),
      (7,14),
      (7,15),
      (7,16),
      (7,17),
      (7,23),
      (7,24),
      (7,25),
      (7,26),
      (7,27),
      (7,28),
      (7,29),
      (7,30),
      (7,47),
      (7,49),
      (7,50),
      (7,54),
      (7,55),
      (7,58),
      (7,59),
      (7,61),
      (7,62),
      (8,60),
      (8,63),
      (8,65),
      (8,66),
      (8,67),
      (9,4),
      (9,23),
      (9,24),
      (9,25),
      (9,26),
      (9,27),
      (9,31),
      (9,32),
      (9,33),
      (9,52),
      (9,53),
      (9,54),
      (9,55),
      (9,56),
      (9,57),
      (9,58),
      (9,59),
      (10,4),
      (10,23),
      (10,24),
      (10,25),
      (10,26),
      (10,27),
      (10,31),
      (10,54),
      (10,58),
      (11,4),
      (13,4),
      (13,23),
      (13,24),
      (13,25),
      (13,26),
      (13,27),
      (13,31),
      (13,32),
      (13,33),
      (14,4),
      (14,31),
      (14,32),
      (14,33);
  `;

  console.log({ result });
}

async function seedSeasonTable() {
  const result = await prisma.$executeRaw`
    INSERT INTO s_season (code,name) VALUES
      (30,'Spring/Summer 2025'),
	    (31,'Autumn/Winter 2025');
  `;

  console.log({ result });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
