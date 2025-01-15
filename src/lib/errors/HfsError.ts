import { None } from "@/src/utils/fp-ts";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

export type HfsResult<T> = E.Either<T, HfsError>;

export interface HfsError {
  status: number;
  message: string;
  cause: O.Option<Error>;
}

export function throwToHfsError(
  status: number,
  message: string,
  cause: O.Option<Error> = None,
): HfsError {
  return {
    status,
    message,
    cause,
  };
}
