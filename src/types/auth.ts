export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: number;
  errors?: {
    email?: string[];
    password?: string[];
  };
  body?: {
    token: string;
    tokenExpiration: number;
  };
};
