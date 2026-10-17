module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  watchman: false,
};
