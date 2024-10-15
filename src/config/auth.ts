export const authConfig = {
  access_token_secret: process.env.ACCESS_TOKEN_SECRET!,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET!,
};

export const ACCESS_TOKEN_LIFETIME = 5 * 60; // 5 minutes
export const REFRESH_TOKEN_LIFETIME = 60 * 60 * 24; // 1 day
