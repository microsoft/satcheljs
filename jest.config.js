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
  testRegex: '/test/.*Tests.tsx?$',
  coverageDirectory: 'build/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
};