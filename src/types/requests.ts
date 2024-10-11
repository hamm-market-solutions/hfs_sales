export type HfsRequest = {
  id: number;
};

export type LoginRequest = {
  email: string;
  password: string;
} & HfsRequest;
