export type HfsResponse = {
  status: number;
  body?: object;
  errors?: object;
};

export type LoginResponse = Override<
  HfsResponse,
  {
    errors?: {
      email?: string[];
      password?: string[];
    };
    body?: {
      token: string;
      tokenExpiration: number;
    };
  }
>;
