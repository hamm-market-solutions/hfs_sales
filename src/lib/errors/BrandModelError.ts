import ModelError from "./ModelError";

export default class BrandModelError extends ModelError {
  public static getError(type: string = "brand"): string {
    return `Failed to get ${type}`;
  }
}
