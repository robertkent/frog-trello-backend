import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./setup-tests.ts"], // specifically load the .env.test
};

export default config;
