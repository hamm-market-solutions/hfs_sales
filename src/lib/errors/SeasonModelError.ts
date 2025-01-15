import ModelError from "./ModelError";

export default class SeasonModelError extends ModelError {
  public static getError(type: string = "season"): string {
    return `Failed to get ${type}`;
  }
}
