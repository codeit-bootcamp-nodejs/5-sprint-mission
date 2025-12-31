import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

jest.setTimeout(30000);

beforeAll(() => {
  process.env.NODE_ENV = "test";
  console.log("테스트 환경 초기화 완료");
});

afterAll(async () => {
  console.log("테스트 정리 완료");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(" Unhandled Rejection at:", promise, "reason:", reason);
});
