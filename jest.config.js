module.exports = {
    transform: {
        '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest',
    },
    testMatch: ['**/*Tests.ts', '**/*Tests.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testRunner: 'jasmine2',
};
