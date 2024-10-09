import "../envConfig.ts";

export const authConfig = {
  jwt_secret: process.env.JWT_SECRET_KEY!,
};
