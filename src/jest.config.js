export default {
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!**/__tests__/**"],
  testMatch: ["**/__tests__/**/*.js"],
};
