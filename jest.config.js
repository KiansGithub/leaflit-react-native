module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect'
    ],
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|@react-native|react-clone-referenced-element|@expo|expo-.*|@unimodules)/)"
    ],
    testPathIgnorePatterns: [
        '/node_modules/', 
        '/android/', 
        '/ios/'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            babelConfig: true,
        }
    }
};