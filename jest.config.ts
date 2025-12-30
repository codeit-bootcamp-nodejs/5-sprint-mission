export default {
  projects: [
    {
      displayName: "api",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/test/jest/api/*.test.ts"],
      setupFilesAfterEnv: ["<rootDir>/src/test/jest/setup.ts"],
    },
    {
      displayName: "service",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/test/jest/service/*.test.ts"],
    },
  ],
};
