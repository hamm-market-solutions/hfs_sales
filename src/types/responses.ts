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

type HfsThrownError = HfsErrResponse<{ thrownError?: string }>;

export type LoginResponse = LoginOkResponse | LoginErrResponse;

export type LoginOkResponse = HfsOkResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export type LoginErrResponse = HfsErrResponse<{
  login?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}> &
  HfsThrownError;

export type RefreshResponse = RefreshOkResponse | RefreshErrResponse;

export type RefreshOkResponse = HfsOkResponse<{
  accessToken: string;
}>;

export type RefreshErrResponse = HfsErrResponse<{
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}> &
  HfsThrownError;

export type GetUserCountriesResponse =
  | GetUserCountriesOkResponse
  | GetUserCountriesErrResponse;

export type GetUserCountriesOkResponse = HfsOkResponse<{
  countries: { code: string; name: string }[];
}>;

export type GetUserCountriesErrResponse = HfsErrResponse<{
  userId?: string;
}> &
  HfsThrownError;
