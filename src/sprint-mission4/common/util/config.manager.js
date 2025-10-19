import dotenv from "dotenv";

export class ConfigManager {
  #configSpec = {
    NODE_ENV: { type: "string", default: "development" },
    PORT: { type: "number", default: 4000 },
    DISK_STORAGE_PATH: { type: "string", default: "public" },
    DATABASE_URL: { type: "string" },
  }

  constructor() {
    dotenv.config({
      path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env"
    });
  }

  get(key) {
    const spec = this.#configSpec[key];
    
    if(!spec){
      throw new Error(`${key}: 환경 변수 스펙이 없습니다.`);
    }
    
    const { type, default: defaultValue} = spec;
    const value = process.env[key];

    if (value === undefined || value === null) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`${key}: 환경 변수 스펙의 값이 없습니다.`);
    }

    switch (type) {
      case "string":
        return value;
      case "number": {
        const numValue = Number(value);
        if (isNaN(numValue)) throw new Error(`${key}: 숫자 형식이 아님`);
        return numValue;
      }
      case "boolean": {
        const lower = value.toLowerCase();
        if (lower !== "true" && lower !== "false")
          throw new Error(`${key}: boolean 형식 아님`);
        return lower === "true";
      }
      default:
        throw new Error(`${key}: 지원되지 않는 타입`);
    }
  
  }

}