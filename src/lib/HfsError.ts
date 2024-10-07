import { ValidationError } from "class-validator";
import { Result } from "ts-results";

export type HfsResult<T> = Result<T, HfsError>;

export default class HfsError extends Error {
  public status: number;
  public messages: string[];
  public name: string;

  constructor(status: number, messages: string[]) {
    super(messages.map((message) => message).join("\n\n"));
    this.status = status;
    this.messages = messages;
    this.name = "HfsError";
  }

  public static fromValidationErrors(
    status: number,
    errors: ValidationError[]
  ): HfsError {
    return new HfsError(
      status,
      errors.map((error) => error.toString())
    );
  }

  public toJson(): string {
    return JSON.stringify({ status: this.status, message: this.message });
  }
}
