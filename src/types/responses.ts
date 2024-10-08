export type HfsResponse = HfsOkResponse | HfsErrResponse;

export type HfsOkResponse = {
  status: number;
  data: object;
};

export type HfsErrResponse = {
  status: number;
  errors: object;
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
};
