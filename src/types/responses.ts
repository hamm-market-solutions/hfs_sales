export type HfsResponse<T extends object = {}, E extends object = {}> =
  | HfsOkResponse<T>
  | HfsErrResponse<E>;

export type HfsOkResponse<T extends object> = {
  status: number;
  data: T;
};

export type HfsErrResponse<T extends object> = {
  status: number;
  errors: T;
  name: string;
  message: string;
  stack?: string;
  cause?: Error;
};
