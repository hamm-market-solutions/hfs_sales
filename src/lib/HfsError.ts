import { ValidationError } from "class-validator";
import { Result } from "ts-results";

export type HfsResult<T> = Result<T, HfsError>;

export default class HfsError extends Error {
  public status: number;
  public errors: object;
  public name: string;

  constructor(status: number, messages: object) {
    super();
    this.status = status;
    this.errors = messages;
    this.name = "HfsError";
  }

  public static fromValidationErrors(
    status: number,
    errors: ValidationError[],
  ): HfsError {
    return new HfsError(status, {
      validationErrors: errors.map((error) => error.constraints),
    });
  }

  // public toJSON() {
  //   const errorResponse: HfsResponse = {
  //     status: this.status,
  //     errors: this.errors,
  //   };

  //   return JSON.stringify(errorResponse);
  // }
}
