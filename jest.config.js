module.exports = {
  testEnvironment: 'node',
  moduleDirectories: [
    "node_modules"
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  testRegex: '/build/test/.*Tests.js$',
  coverageDirectory: 'build/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
};