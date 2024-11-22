import { Result } from "ts-results";

import { HfsErrResponse } from "@/types/responses";

export type HfsResult<T> = Result<T, HfsError>;

export default class HfsError extends Error {
  public status: number;
  public error: string;
  public name: string;
  public cause?: Error;

  constructor(status: number, message: string, cause?: Error) {
    super(JSON.stringify(message));
    this.status = status;
    this.error = message;
    this.name = "HfsError";
    this.cause = cause;
  }

  public static fromThrow(
    status: number,
    message: string,
    cause?: Error,
  ): HfsError {
    return new HfsError(status, message, cause);
  }

  public static fromHfsResponse(response: HfsErrResponse): HfsError {
    return new HfsError(response.status, response.error, response.cause);
  }

  public is(type: string): boolean {
    return this.error == type;
  }
}

export const EmptyHfsError = new HfsError(
  0,
  "Empty Error. This should not happen.",
);
