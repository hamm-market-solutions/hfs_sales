import ModelError from "./ModelError";

export default class UserModelError extends ModelError {
  public static notFound(type: string = "user"): string {
    return super.notFound(type);
  }

  public static updateError(type: string = "user"): string {
    return `Failed to update ${type}`;
  }

  public static passwordMismatch(): string {
    return "incorrect email or password";
  }
}
