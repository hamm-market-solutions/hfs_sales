import { getOrders } from "./getters";
import {
  up as sPurchaseheadUp,
  down as sPurchaseheadDown,
} from "./seed_s_purchase_head";
import {
  up as sPurchaseLineUp,
  down as sPurchaseLineDown,
} from "./seed_s_purchase_line";
import {
  up as sVariantUp,
  down as sVariantDown,
} from "./seed_s_variant";
import minimist from "minimist";
import { writeFile, writeFileSync } from "fs";

const OPTIONS = `
  Options:
    up <seeder?>: Seed the database
      --seeder: The seeder to run
    down <seeder?>: Remove all data from the database
      --seeder: The seeder to run
    reset <seeder?>: Remove all data from the database and seed it again
    get <getter>: Get data from the database
      getters:
        orders: Get all order numbers
    help: Display this help message
`;

type Seeder = keyof typeof ups | keyof typeof downs;
type Command = "up" | "down" | "reset" | "get" | "help";
type SubCommand = {
  "get": "orders";
  "up": undefined;
  "down": undefined;
  "reset": undefined;
  "help": undefined;
};
type CommandArgs = {
  "up": {
    "output"?: string;
    "seeder"?: Seeder;
  }
  "down": {
    "output"?: string;
    "seeder"?: Seeder;
  }
  "reset": {
    "output"?: string;
    "seeder"?: Seeder;
  };
  "get": {
    "output"?: string;
  };
  "help": {
    "output"?: string;
  };
};

const ups = {
  s_purchase_head: sPurchaseheadUp,
  s_purchase_line: sPurchaseLineUp,
  s_variant: sVariantUp,
};

const downs = {
  s_purchase_head: sPurchaseheadDown,
  s_purchase_line: sPurchaseLineDown,
  s_variant: sVariantDown,
};

async function up(seeder?: CommandArgs["up"]) {
  if (seeder?.seeder) {
    const s = seeder.seeder;
    if (ups[s]) {
      console.log(`Seeding ${s}`);
      await ups[s]();
    } else {
      throw new Error(`Seeder ${s} does not exist`);
    }

    return;
  }

  for (const [name, up] of Object.entries(ups)) {
    console.log(`Seeding ${name}`);
    await up();
  }
}

async function down(seeder?: CommandArgs["down"]) {
  if (seeder?.seeder) {
    const s = seeder.seeder;
    if (downs[s]) {
      console.log(`Removing data from ${s}`);
      await downs[s]();
    } else {
      throw new Error(`Seeder ${s} does not exist`);
    }

    return;
  }

  for (const [name, down] of Object.entries(downs)) {
    console.log(`Removing data from ${name}`);
    await down();
  }
}

async function runner(mainCommand: Command, subCommand: SubCommand[typeof mainCommand], commandArgs: CommandArgs[typeof mainCommand]) {
  if (mainCommand === "help") {
    return OPTIONS;
  }
  if (mainCommand === "up") {
    await up(commandArgs);

    return "Seeding complete";
  }
  if (mainCommand === "down") {
    await down(commandArgs);

    return "Data removed";
  }
  if (mainCommand === "reset") {
    await down(commandArgs);
    await up(commandArgs);

    return "Database reset";
  }
  if (mainCommand === "get") {
    if (subCommand === "orders") {
      return getOrders();
    }
  }

  throw new Error(OPTIONS);
}

async function main() {
  const argv = process.argv.slice(2);
  const args = minimist(argv);

  if (args.length === 0) {
    return OPTIONS;
  }
  const commands = args._;
  const mainCommand = commands[0] as Command;
  const subCommand = commands[1] as SubCommand[typeof mainCommand];
  const commandArgs = Object.fromEntries(
    Object.entries(args).filter(([key]) => key !== "_")
  ) as CommandArgs[typeof mainCommand];
  const result = await runner(mainCommand, subCommand, commandArgs);

  if (Object.keys(commandArgs).includes("output")) {
    const outputPath = commandArgs["output"] ?? "";
    if (Array.isArray(result) || typeof result === "object") {
      writeFileSync(outputPath, JSON.stringify(result));
    } else {
      writeFileSync(outputPath, result ?? "");
    }
    return `Output written to ${outputPath}`;
  } else {
    return result;
  }
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
