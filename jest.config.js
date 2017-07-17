module.exports = {
  testEnvironment: 'node',
  moduleDirectories: [
    "node_modules"
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx'
  ],
  transform: {
    '.(ts|tsx)': '<rootDir>/jest.preprocessor.js'
  },
  transformIgnorePatterns: ['node_modules', 'build'],
  testMatch: ['**/*Tests.ts'],
  coverageDirectory: 'build/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
};