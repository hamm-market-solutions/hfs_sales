export type HfsRequest = {
  id?: number;
};

export type LoginRequest = {
  email: string;
  password: string;
} & HfsRequest;

export type RefreshRequest = {
  refreshToken: string;
} & HfsRequest;

export type GetUserCountriesRequest = HfsRequest;
