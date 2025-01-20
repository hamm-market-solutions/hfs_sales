import { exportLatestForecasts } from "@/lib/models/forecast";
import { unwrap } from "@/utils/fp-ts";
import { writeFileSync } from "fs";

export const runner = async (command: string, commandArgs: { [key: string]: string }) => {
    if (command === "forecasts") {
        console.log("Exporting forecasts...");
        const data = unwrap(await exportLatestForecasts());

        if (Object.keys(commandArgs).includes("--output")) {
            console.log(`Writing to ${commandArgs["--output"]}`);
            writeFileSync(commandArgs["--output"], JSON.stringify(data));
            return `Forecasts written to ${commandArgs["--output"]}`;
        } else {
            return data;
        }
    }
}
