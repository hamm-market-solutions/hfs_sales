import { HfsResponse } from "@/types/responses";
import { ValidationError } from "class-validator";
import { Result } from "ts-results";

export type HfsResult<T> = Result<T, HfsError>;

export default class HfsError extends Error {
  public status: number;
  public messages: object;
  public name: string;

  constructor(status: number, messages: object) {
    super();
    this.status = status;
    this.messages = messages;
    this.name = "HfsError";
  }

  public static fromValidationErrors(
    status: number,
    errors: ValidationError[]
  ): HfsError {
    console.log(errors);

    return new HfsError(
      status,
      errors.map((error) => error.toString())
    );
  }

  public toJSON() {
    const errorResponse: HfsResponse = {
      status: this.status,
      errors: this.messages,
    };

    return JSON.stringify(errorResponse);
  }
}
