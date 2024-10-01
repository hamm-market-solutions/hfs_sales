export type Response = {
  status: number;
  body?: object;
  errors?: object;
};

export type LoginResponse = {
  errors?: {
    email?: string[];
    password?: string[];
  };
} & Response;
