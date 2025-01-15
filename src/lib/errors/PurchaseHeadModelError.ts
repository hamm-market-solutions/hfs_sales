import ModelError from "./ModelError";

export default class PurchaseHeadModelError extends ModelError {
  public static sumError(type: string): string {
    return `failed to sum ${type}`;
  }
}
