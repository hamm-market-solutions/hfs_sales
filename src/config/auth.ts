import "../envConfig.ts";

export const authConfig = {
  jwt: {
    secret_key: process.env.JWT_SECRET_KEY!,
  },
};
