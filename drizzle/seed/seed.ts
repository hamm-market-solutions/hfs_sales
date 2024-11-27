import {
  up as sPurchaseheadUp,
  down as sPurchaseheadDown,
} from "./seed_s_purchase_head";
import {
  up as sPurchaseLineUp,
  down as sPurchaseLineDown,
} from "./seed_s_purchase_line";

const OPTIONS = `
  Options:
    - up <seeder?>: Seed the database
    - down <seeder?>: Remove all data from the database
    - reset <seeder?>: Remove all data from the database and seed it again
    - help: Display this help message
`;

type Seeder = keyof typeof ups | keyof typeof downs;

const ups = {
  s_purchase_head: sPurchaseheadUp,
  s_purchase_line: sPurchaseLineUp,
};

const downs = {
  s_purchase_head: sPurchaseheadDown,
  s_purchase_line: sPurchaseLineDown,
};

async function up(seeder?: keyof typeof ups) {
  if (seeder) {
    if (ups[seeder]) {
      console.log(`Seeding ${seeder}`);
      await ups[seeder]();
    } else {
      throw new Error(`Seeder ${seeder} does not exist`);
    }

    return;
  }

  for (const [name, up] of Object.entries(ups)) {
    console.log(`Seeding ${name}`);
    await up();
  }
}

async function down(seeder?: keyof typeof downs) {
  if (seeder) {
    if (downs[seeder]) {
      console.log(`Removing data from ${seeder}`);
      await downs[seeder]();
    } else {
      throw new Error(`Seeder ${seeder} does not exist`);
    }

    return;
  }

  for (const [name, down] of Object.entries(downs)) {
    console.log(`Removing data from ${name}`);
    await down();
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return OPTIONS;
  }
  const command = args[0];
  const seeder = args[1] as Seeder;

  if (command === "help") {
    return OPTIONS;
  }
  if (command === "up") {
    await up(seeder);

    return "Seeding complete";
  }
  if (command === "down") {
    await down(seeder);

    return "Data removed";
  }
  if (command === "reset") {
    await down(seeder);
    await up(seeder);

    return "Database reset";
  }

  throw new Error(OPTIONS);
}

main()
  .then(async (out) => {
    console.log(out);
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
