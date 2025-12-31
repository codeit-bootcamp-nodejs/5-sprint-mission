import dotenv from "dotenv";
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
console.log(`Loading: ${envFile}`);

dotenv.config({ path: envFile });
dotenv.config({ path: ".env" });
export type Environment = "development" | "production" | "test";

export const NODE_ENV: Environment =
  (process.env.NODE_ENV as Environment) || "development";
export const PORT: number = parseInt(process.env.PORT || "3000", 10);
export const SERVER_HOST: string = process.env.SERVER_HOST || "localhost";
export const API_URL: string =
  process.env.API_URL || `http://${SERVER_HOST}:${PORT}`;
export const DATABASE_URL: string = process.env.DATABASE_URL || "";

export const AWS_S3_ENABLED: boolean = process.env.AWS_S3_ENABLED === "true";
export const AWS_S3_BUCKET_NAME: string = process.env.AWS_S3_BUCKET_NAME || "";
export const AWS_S3_REGION: string =
  process.env.AWS_S3_REGION || "ap-northeast-2";
export const AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY: string =
  process.env.AWS_SECRET_ACCESS_KEY || "";
export const S3_IMAGE_BASE_URL: string = process.env.S3_IMAGE_BASE_URL || "";
export const PUBLIC_PATH: string = "./public";
export const STATIC_PATH: string = "/public";
export const IMAGE_BASE_URL: string =
  NODE_ENV === "production"
    ? process.env.IMAGE_BASE_URL || S3_IMAGE_BASE_URL
    : `http://${SERVER_HOST}:${PORT}/public`;
export const IMAGE_UPLOAD_DIR: string =
  process.env.IMAGE_UPLOAD_DIR || "./uploads";
export const MAX_IMAGE_SIZE: number = parseInt(
  process.env.MAX_IMAGE_SIZE || "10485760",
  10,
);
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

export const CORS_ORIGIN: string[] = getCorsOrigin();

function getCorsOrigin(): string[] {
  if (NODE_ENV === "production") {
    const origins = process.env.CORS_ORIGIN?.split(",") || [
      "https://yourdomain.com",
    ];
    return origins.map((origin) => origin.trim());
  }
  return [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
  ];
}

export const SOCKET_IO_CORS_ORIGIN: string =
  process.env.SOCKET_IO_CORS_ORIGIN || "http://localhost:3000";

export const LOG_LEVEL: string =
  process.env.LOG_LEVEL || (NODE_ENV === "production" ? "info" : "debug");
export const LOG_FILE_PATH: string =
  process.env.LOG_FILE_PATH || "./logs/app.log";
export const SMTP_HOST: string = process.env.SMTP_HOST || "";
export const SMTP_PORT: number = parseInt(process.env.SMTP_PORT || "587", 10);
export const SMTP_USER: string = process.env.SMTP_USER || "";
export const SMTP_PASSWORD: string = process.env.SMTP_PASSWORD || "";
export const SMTP_FROM: string = process.env.SMTP_FROM || "";

export const SENTRY_DSN: string = process.env.SENTRY_DSN || "";
export const SENTRY_ENABLED: boolean =
  SENTRY_DSN.length > 0 && NODE_ENV === "production";

export const REDIS_URL: string = process.env.REDIS_URL || "";
export const REDIS_ENABLED: boolean = REDIS_URL.length > 0;

export const RATE_LIMIT_WINDOW_MS: number = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || "900000",
  10,
);
export const RATE_LIMIT_MAX_REQUESTS: number = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || "100",
  10,
);

export const USE_HTTPS: boolean =
  process.env.USE_HTTPS === "true" || NODE_ENV === "production";
export const CERT_PATH: string = process.env.CERT_PATH || "";
export const KEY_PATH: string = process.env.KEY_PATH || "";

export function validateConfig(): void {
  const errors: string[] = [];

  if (!DATABASE_URL) {
    errors.push("DATABASE_URL is not configured.");
  }

  if (NODE_ENV === "production") {
    if (!JWT_SECRET || JWT_SECRET === "changeme-secret") {
      errors.push(
        "JWT_SECRET is not configured or is using default value. (production)",
      );
    }
    if (
      !REFRESH_TOKEN_SECRET ||
      REFRESH_TOKEN_SECRET === "changeme-refresh-secret"
    ) {
      errors.push(
        "REFRESH_TOKEN_SECRET is not configured or is using default value. (production)",
      );
    }
    if (AWS_S3_ENABLED && !AWS_S3_BUCKET_NAME) {
      errors.push(
        "AWS_S3_ENABLED is true but AWS_S3_BUCKET_NAME is not configured.",
      );
    }
  }

  if (errors.length > 0) {
    console.error("\nConfiguration validation failed:\n" + errors.join("\n"));
    if (NODE_ENV === "production") {
      process.exit(1);
    }
  } else {
    console.log("Configuration validation completed.");
  }
}

export function logConfig(): void {
  console.log("\nCurrent configuration:");
  console.log("==========================================");
  console.log(`NODE_ENV: ${NODE_ENV}`);
  console.log(`PORT: ${PORT}`);
  console.log(`SERVER_HOST: ${SERVER_HOST}`);
  console.log(`DATABASE_URL: ${DATABASE_URL.substring(0, 50)}...`);
  console.log(`AWS S3: ${AWS_S3_ENABLED ? "enabled" : "disabled"}`);
  console.log(`IMAGE_BASE_URL: ${IMAGE_BASE_URL}`);
  console.log(`CORS_ORIGIN: ${CORS_ORIGIN.join(", ")}`);
  console.log("==========================================\n");
}

validateConfig();
