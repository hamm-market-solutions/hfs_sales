import ModelError from "./ModelError";

export default class ForecastModelError extends ModelError {
    public static getError(type: string = "forecast"): string {
        return `Failed to get ${type}`;
    }

    public static saveForecastError(): string {
        return "Failed to create a new forecast entry";
    }
}
