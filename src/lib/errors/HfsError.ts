import { Result } from "ts-results";

import { HfsErrResponse } from "@/types/responses";

export type HfsResult<T> = Result<T, HfsError>;

export default class HfsError extends Error {
  public status: number;
  public errors: object;
  public name: string;
  public cause?: Error;

  constructor(
    status: number,
    messages: { [type: string]: string },
    cause?: Error,
  ) {
    super(JSON.stringify(messages));
    this.status = status;
    this.errors = messages;
    this.name = "HfsError";
    this.cause = cause;
  }

  public static fromThrow(
    status: number,
    message: string,
    cause?: Error,
  ): HfsError {
    return new HfsError(status, { thrownError: message }, cause);
  }

  public static fromHfsResponse<T extends { [type: string]: string }>(
    response: HfsErrResponse<T>,
  ): HfsError {
    return new HfsError(response.status, response.errors, response.cause);
  }

  public is(type: string): boolean {
    return Object.values(this.errors).includes(type);
  }
}
