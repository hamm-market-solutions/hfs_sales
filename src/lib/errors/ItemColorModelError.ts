import ModelError from "./ModelError";

export default class ItemColorModelError extends ModelError {
  public static getError(type: string = "item color"): string {
    return `Failed to get ${type}`;
  }

  public static getForecastDataError(): string {
    return "Failed to get forecast data from item color";
  }
}
