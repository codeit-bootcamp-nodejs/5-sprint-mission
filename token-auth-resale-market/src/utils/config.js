import dotenv from "dotenv";

export class ConfigUtil {
  #configSpec = {
    NODE_ENV: { type: "string", default: "development" },
    PORT: { type: "number", default: 3000 },
    DATABASE_URL: { type: "string" },
    IMAGE_BASE_URL: { type: "string" },
    TOKEN_SECRET: { type: "string" },
  };

  constructor() {
    dotenv.config({
      path: `.env.${process.env.NODE_ENV}`,
    });
  }

  get(key) {
    const spec = this.#configSpec[key];
    if (!spec) {
      throw new Error({
        message: `${key}: 환경 변수 스펙이 정의되지 않았습니다.`,
      });
    }

    const { type, default: defaultValue } = spec;
    const value = process.env[key];
    if (value === undefined || value === null) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error({
        message: `${key}: 환경 변수 스펙이 정의되지 않았습니다.`,
      });
    }

    switch (type) {
      case "string":
        return value;
      case "number": {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          throw new Error({
            message: `${key}: 환경 변수가 숫자 형식이 아닙니다.`,
          });
        }
        return numValue;
      }
      case "boolean": {
        const lowerCaseValue = value.toLowerCase();
        if (lowerCaseValue !== "true" && lowerCaseValue !== "false") {
          throw new Error({
            message: `${key}: 환경 변수가 참, 거짓 형식이 아닙니다.`,
          });
        }
        return lowerCaseValue === "true";
      }
      default:
        throw new Error({
          message: `${key}: 지원되지 않는 타입의 환경 변수입니다.`,
        });
    }
  }
}
