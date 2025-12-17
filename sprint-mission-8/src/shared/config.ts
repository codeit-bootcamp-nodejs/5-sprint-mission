import dotenv from "dotenv";
import { z } from "zod";

export const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number(),
  PUBLIC_PATH: z.string().default("public"),
  DATABASE_URL: z.url(),
  IMAGE_BASE_URL: z.string().url().default("http://test"),
  COOKIE_SECRET: z
    .string()
    .min(10, "세션 아이디 비밀번호는 최소 10자 이상입니다."),
  TOKEN_SECRET: z.string().min(10, "토큰 시크릿은 최소 10자 이상입니다."),
  ACCESS_TOKEN_EXPIRES_IN: z.enum(["15m", "1h"]).default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.enum(["7d"]).default("7d"),
});

export type ConfigType = z.infer<typeof configSchema>;

export interface IConfigUtil {
  parsed: () => ConfigType;
}

export class ConfigUtil implements IConfigUtil {
  private _parsedConfig: ConfigType;

  constructor() {
    dotenv.config({
      path:
        process.env.NODE_ENV === "development"
          ? ".env.dev"
          : process.env.NODE_ENV === "test"
            ? ".env.test"
            : ".env.prod",
    });
    const result = configSchema.safeParse(process.env);
    if (result.success) {
      this._parsedConfig = result.data;
    } else {
      throw new Error(
        result.error.issues[0].path + ": " + result.error.issues[0].message,
      );
    }
  }

  public parsed() {
    return this._parsedConfig;
  }
}
