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
import {
    up as sAssortmentUp,
    down as sAssortmentDown,
} from "./seed_s_assortment";
import {
    up as userUp,
    down as userDown,
} from "./seed_user";
import {
    up as menuUp,
    down as menuDown,
} from "./seed_menu";
import {
    up as sSeasonUp,
    down as sSeasonDown,
} from "./seed_s_season";
import {
    up as roleUp,
    down as roleDown,
} from "./seed_role";
import {
    up as userHasRoleUp,
    down as userHasRoleDown,
} from "./seed_user_has_role";
import {
    up as permissionUp,
    down as permissionDown,
} from "./seed_permission";
import {
    up as roleHasPermissionUp,
    down as roleHasPermissionDown,
} from "./seed_role_has_permission";
import {
    up as sCountryUp,
    down as sCountryDown,
} from "./seed_s_country";
import {
    up as brandUp,
    down as brandDown,
} from "./seed_brand";
import {
    up as sSeasonBrandPhaseUp,
    down as sSeasonBrandPhaseDown,
} from "./seed_s_season_brand_phase";
import {
    up as userHasCountryUp,
    down as userHasCountryDown,
} from "./seed_user_has_country";
import {
    up as sItemUp,
    down as sItemDown,
} from "./seed_s_item";
import {
    up as sItemColorUp,
    down as sItemColorDown,
} from "./seed_s_item_color";

import * as schemas from "../../src/db/schema";

import minimist from "minimist";
import { writeFileSync } from "node:fs";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

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
    "all"?: boolean;
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
    user: userUp,
    menu: menuUp,
    role: roleUp,
    permission: permissionUp,
    role_has_permission: roleHasPermissionUp,
    s_season: sSeasonUp,
    s_country: sCountryUp,
    brand: brandUp,
    s_season_brand_phase: sSeasonBrandPhaseUp,
    user_has_country: userHasCountryUp,
    s_item: sItemUp,
    s_item_color: sItemColorUp,
    user_has_role: userHasRoleUp,
    s_purchase_head: sPurchaseheadUp,
    s_purchase_line: sPurchaseLineUp,
    s_variant: sVariantUp,
    s_assortment: sAssortmentUp,
};

const downs = {
    s_assortment: sAssortmentDown,
    s_variant: sVariantDown,
    s_purchase_line: sPurchaseLineDown,
    s_purchase_head: sPurchaseheadDown,
    user_has_role: userHasRoleDown,
    s_item_color: sItemColorDown,
    s_item: sItemDown,
    user_has_country: userHasCountryDown,
    s_season_brand_phase: sSeasonBrandPhaseDown,
    brand: brandDown,
    s_country: sCountryDown,
    s_season: sSeasonDown,
    role_has_permission: roleHasPermissionDown,
    permission: permissionDown,
    role: roleDown,
    menu: menuDown,
    user: userDown,
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
    if (seeder?.all) {
        const db = drizzle(process.env.DATABASE_URL!);
        await db.transaction(async (tx) => {
            await tx.execute(sql`SET FOREIGN_KEY_CHECKS = 0; `);
            for (const [name, schema] of Object.entries(schemas)) {
                console.log(`Removing data from ${name}`);
                await tx.execute(sql`TRUNCATE TABLE ${schema}; `);
            }
            await tx.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
        })

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
