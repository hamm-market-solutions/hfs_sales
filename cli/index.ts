import minimist from "minimist";
import { runner as seedRunner } from "./seed/seed";
import { runner as exportRunner } from "./export";

type Param = {
    name: string;
    type: string;
    optional: boolean;
    description: string[];
}
type Command = {
    name: string;
    params?: Param[];
    description: string[];
}
type Args = {
    [command: string]: {
        params?: Param[];
        commands?: Command[];
        description?: string[];
    }
}

export const ARGS: Args = {
    seed: {
        params: [
            { name: "seeder", type: "string", optional: true, description: ["The seeder to run"] }
        ],
        commands: [
            {
                name: "up",
                description: ["Seed the database"],
            },
            {
                name: "down",
                description: ["Remove data from the database"],
            },
            {
                name: "reset",
                description: ["Remove all data from the database and seed it again"],
            },
            {
                name: "get",
                description: ["Get data from the seeder files."],
                params: [
                    { name: "getter", type: "string", optional: false, description: [
                        "Getters:",
                        "  orders: Get all order numbers",
                    ] }
                ]
            },
        ],
    },
    export: {
        commands: [
            {
                name: "forecasts",
                description: ["Export the latest forecasts"],
                params: [{ name: "output", type: "string", optional: true, description: ["The output file to write the data to"] }],
            },
        ],
    },
    help: {
        description: ["Display this help message"],
    },
}

const getArgsDefAsHelp = () => {
    const args = Object.entries(ARGS).map(([mainCommand, options]) => {
        const commands = options.commands ?? [];
        const commandHelp = commands.map(({ name, description }) => {
            const params = options.params?.map(({ name, type, optional, description }) => {
                return `        --${name} (${type})${optional ? " (optional)" : ""}: ${description.join("\n")}`;
            }).join("\n");
            return `    ${name}: ${description.join(" ")}\n${params ? params : ""}\n`;
        }).join("\n\n");

        return `${mainCommand}: ${options.description ?? ""}\n${commandHelp}`;
    }).join("\n\n");
    return `Commands for the HF Sales CLI:\n${args}`;
}

const getParams = (args: minimist.ParsedArgs): { [key: string]: string } => {
    const parsedParams: { [key: string]: string } = {};

    for (const arg of args._.slice(2)) {
        const [key, value] = arg.split("=");
        parsedParams[key] = value ?? true;
    }

    return parsedParams;
}

export const main = async () => {
    const argv = process.argv.slice(2);
    const args = minimist(argv);

    const mainCommand = args._[0];
    const subCommand = args._[1];
    const params = getParams(args);
    console.log(mainCommand, subCommand, params);


    if (mainCommand === "help") {
        return getArgsDefAsHelp();
    }
    if (mainCommand === "seed") {
        return await seedRunner(subCommand, params);
    }
    if (mainCommand === "export") {
        return await exportRunner(subCommand, params);
    }

    return getArgsDefAsHelp();
};

main()
    .then(async (out) => {
        console.log(out);
        process.exit(0);
    })
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    });