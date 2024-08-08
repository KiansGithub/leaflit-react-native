module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    moduleNameMapper: {
        '^axios$': '<rootDir>/__mocks__/axios.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
    },
};