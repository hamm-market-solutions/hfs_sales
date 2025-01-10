import { Result } from "ts-results";

export type HfsResult<T> = Result<T, HfsError>;

// export default class HfsError {
//     public status: number;
//     public message: string;
//     public name: string;
//     public cause?: Error;

//     constructor(status: number, message: string, cause?: Error) {
//         this.status = status;
//         this.message = message;
//         this.name = "HfsError";
//         this.cause = cause;
//     }

//     public static fromThrow(
//         status: number,
//         message: string,
//         cause?: Error,
//     ): HfsError {
//         return new HfsError(status, message, cause);
//     }

//     public static fromHfsResponse(response: HfsErrResponse): HfsError {
//         return new HfsError(response.status, response.error, response.cause);
//     }

//     public is(type: string): boolean {
//         return this.message == type;
//     }
// }

export interface HfsError {
    status: number;
    message: string;
    cause?: Error;
}

export function throwToHfsError(status: number, message: string, cause?: Error): HfsError {
    return {
        status,
        message,
        cause,
    };
}
