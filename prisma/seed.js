import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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
  console.log({ admin: admin });
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
