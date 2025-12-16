import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || "";

export const PORT: number = Number(process.env.PORT) || 3000;
export const SERVER_HOST: string = process.env.SERVER_HOST || "localhost";

export const PUBLIC_PATH: string = "./public";
export const STATIC_PATH: string = "/public";
export const IMAGE_BASE_URL: string =
  process.env.IMAGE_BASE_URL || `http://${SERVER_HOST}:${PORT}`;

export const JWT_SECRET: string =
  process.env.JWT_SECRET || process.env.TOKEN_SECRET || "changeme-secret";
export const REFRESH_TOKEN_SECRET: string =
  process.env.REFRESH_TOKEN_SECRET ||
  process.env.COOKIE_SECRET ||
  "changeme-refresh-secret";
export const COOKIE_SECRET: string =
  process.env.COOKIE_SECRET || "changeme-cookie-secret";

export const ACCESS_TOKEN_EXPIRES_IN: string =
  process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
export const REFRESH_TOKEN_EXPIRES_IN: string =
  process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
