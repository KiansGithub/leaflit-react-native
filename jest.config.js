module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect'
    ],
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|@react-native|expo-.*|@expo|@unimodules|sentry-expo|native-base|@react-navigation)/)"
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testPathIgnorePatterns: [
        '/node_modules/', 
        '/android/', 
        '/ios/'
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};