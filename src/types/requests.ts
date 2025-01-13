import { Option } from "ts-results";

export type HfsRequest = {
  id: Option<number>;
};

export type LoginRequest = {
  email: string;
  password: string;
} & HfsRequest;

export type RefreshRequest = {
  refreshToken: string;
} & HfsRequest;

export type GetUserCountriesRequest = HfsRequest;
