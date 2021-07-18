const path = require('path');

module.exports = {
  rootDir: path.resolve('.'),
  roots: ['<rootDir>/src'],
  testRegex: '.+\\.test\\.(js|ts|tsx|jsx)$',
  collectCoverageFrom: ['**/*.(js|ts|tsx|jsx)'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/config/',
    '<rootDir>/src/index.ts',
  ],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: [path.join(__dirname, 'jestUnitSetup.js')],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      path.join(__dirname, 'fileMock.js'),
    '\\.(scss|css)$': path.join(__dirname, 'styleMock.js'),
  },
  moduleFileExtensions: ['ts', 'jsx', 'js', 'tsx'],
  testEnvironment: 'jest-environment-jsdom',
};
