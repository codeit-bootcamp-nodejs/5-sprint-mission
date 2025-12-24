import dotenv from "dotenv";
import z from "zod";

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test", "prod"]).default("development"),
  PORT: z.coerce.number(),
  DISK_STORAGE_PATH: z.string().default("public"),
  DATABASE_URL: z.url(),
  TOKEN_SECRET: z.string().min(10, "토큰 시크릿은 최소 10자 이상입니다."),
  SALT_LEVEL: z.coerce.number().min(8, "솔트 레벨은 최소 8이상으로 권장합니다.").max(12, "솔트 레벨은 최대 12이하로 권장합니다."),
  ACCESS_TOKEN_EXPIRES_IN: z.enum(["15m", "1h", "6h"]).default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.enum(["7d"]).default("7d"),
  CLIENT_DOMAIN: z.string()
});

export type ConfigType = z.infer<typeof configSchema>;

export interface IConfigUtil {
  getParsed: () => ConfigType;
}

export class ConfigUtil implements IConfigUtil {
  private _parseConfig: ConfigType;

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
      this._parseConfig = result.data;
    } else {
      throw result.error;
    }
  }

  public getParsed() {
    return this._parseConfig;
  }
}
