import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await seedUserTable();
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
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      id: 1,
      name: "admin",
    },
  });
  const salesRole = await prisma.role.upsert({
    where: { name: "sales" },
    update: {},
    create: {
      id: 2,
      name: "sales",
    },
  });
  const salesPersonRole = await prisma.role.upsert({
    where: { name: "sales_person" },
    update: {},
    create: {
      id: 3,
      name: "sales_person",
    },
  });
}

async function seedUserHasRoleTable() {
  
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
