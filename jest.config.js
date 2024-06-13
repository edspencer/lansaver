const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ["<rootDir>"],
};
