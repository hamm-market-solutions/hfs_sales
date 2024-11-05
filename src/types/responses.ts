export type HfsResponse<T extends object = {}> =
  | HfsOkResponse<T>
  | HfsErrResponse;

export type HfsOkResponse<T extends object> = {
  status: number;
  data: T;
};

export type HfsErrResponse = {
  status: number;
  error: string;
  name: string;
  message: string;
  stack?: string;
  cause?: Error;
};

type HfsThrownError = HfsErrResponse;

export type LoginResponse = LoginOkResponse | LoginErrResponse;

export type LoginOkResponse = HfsOkResponse<{
  accessToken: string;
}>;

export type LoginErrResponse = HfsErrResponse & HfsThrownError;

export type RefreshResponse = RefreshOkResponse | RefreshErrResponse;

export type RefreshOkResponse = HfsOkResponse<{
  accessToken: string;
}>;

export type RefreshErrResponse = HfsErrResponse & HfsThrownError;

export type GetUserCountriesResponse =
  | GetUserCountriesOkResponse
  | GetUserCountriesErrResponse;

export type GetUserCountriesOkResponse = HfsOkResponse<{
  countries: { code: string; name: string }[];
}>;

export type GetUserCountriesErrResponse = HfsErrResponse & HfsThrownError;
