export const PORT = Number(process.env.PORT) || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:4000";
import dotenv from "dotenv";
dotenv.config();

export const CONFIG_KEY = {
  PORT: "PORT",
  DATABASE_URL: "DATABASE_URL",
  ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
  REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
} as const;

export class Config {
  get(key: keyof typeof CONFIG_KEY): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`환경 변수 ${key} 가 설정되어 있지 않습니다.`);
    }
    return value;
  }

  getPort(): number {
    const port = process.env.PORT || "3000";
    return parseInt(port, 10);
  }
}

export const config = new Config();