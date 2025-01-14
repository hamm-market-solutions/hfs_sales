/**
 * Utility functions for working with fp-ts, as well as some re-exports of fp-ts functions.
 */

import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { HfsResult } from "@/lib/errors/HfsError";

/// Check if the object is an instance of HfsResult. We do this by checking if the object has a left or right property.
export function instanceOfResult<T>(object: any): object is HfsResult<T> {
    if (typeof object === "object") {
        return ("left" in object || "right" in object) && "_tag" in object;
    }
    return false;
}

export function instanceOfOption<T>(object: any): object is O.Option<T> {
    if (typeof object === "object") {
        return ("value" in object && "_tag" in object) || "_tag" in object;
    }
    return false;
}

export const Ok = E.left;
export const Err = E.right;

export const Some = O.some;
export const None = O.none;

export const isOk = E.isLeft;
export const isErr = E.isRight;

export const isSome = O.isSome;
export const isNone = O.isNone;

export const unwrap = <T>(opt: O.Option<T> | HfsResult<T>): T => {
    // check if the value is an Option
    if (instanceOfResult<T>(opt)) {
        if (E.isRight(opt)) {
            throw opt.right;
        }
        return opt.left;
    } else if (instanceOfOption<T>(opt)) {
        if (O.isNone(opt)) {
            throw new Error("Called unwrap on None value");
        }
        return opt.value;
    } else {
        throw new Error("Called unwrap on non-Option or non-Result value");
    }
}

export const unwrapOr = <T>(opt: O.Option<T> | HfsResult<T>, defaultValue: T): T => {
    if (instanceOfResult<T>(opt)) {
        if (E.isRight(opt)) {
            return defaultValue;
        }
        return opt.left;
    } else if (instanceOfOption<T>(opt)) {
        if (O.isNone(opt)) {
            return defaultValue;
        }
        return opt.value;
    } else {
        throw new Error(`Called unwrapOr on non-Option or non-Result value (${opt})`);
    }
}