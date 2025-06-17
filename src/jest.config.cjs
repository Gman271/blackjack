/** @type {import('jest').Config} */
module.exports = {
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
