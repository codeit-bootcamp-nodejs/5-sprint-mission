import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  testMatch: ["**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/service/**/*.ts",
    "src/controller/**/*.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};

export default config;