import "../envConfig.ts";

export const authConfig = {
  jwt: {
    secret_key: process.env.NEXT_PUBLIC_JWT_SECRET_KEY!,
  },
};
