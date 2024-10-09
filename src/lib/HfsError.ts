import { ValidationError } from "class-validator";
import { Result } from "ts-results";

export type HfsResult<T> = Result<T, HfsError>;

export default class HfsError extends Error {
  public status: number;
  public errors: object;
  public name: string;
  public cause?: Error;

  constructor(status: number, messages: object, cause?: Error) {
    super(cause?.message);
    this.status = status;
    this.errors = messages;
    this.name = "HfsError";
    this.cause = cause;
  }

  public static fromValidationErrors(
    status: number,
    errors: ValidationError[],
  ): HfsError {
    let err = {};

    errors.forEach((error) => {
      const field = error.property;
      const constraints = Object.values(error.constraints as object);

      err = { ...err, [field]: constraints };
    });

    return new HfsError(status, err);
  }

  public static fromErrors(
    status: number,
    messages: object,
    cause?: Error,
  ): HfsError {
    return new HfsError(status, messages, cause);
  }
}
