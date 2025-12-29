export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  verbose: true,
  forceExit: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/generated/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
};
