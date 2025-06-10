/** @type {import('jest').Config} */
const config = {
    // ES Module support is automatically inferred from package.json "type": "module"
    testEnvironment: 'node',
    transform: {},
    
    // Module configuration for ES modules
    moduleFileExtensions: ['js', 'json', 'node'],
    testMatch: ['**/tests/**/*.test.js'],
    
    // Module name mapping to handle relative imports correctly
    moduleNameMapper: {
        '^(\\..{1,2}/.*)\.js$': '$1'
    },
    
    // Verbose output for better debugging
    verbose: true,
    
    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/**/index.js'
    ],
    
    // Setup files if needed
    setupFilesAfterEnv: [],
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Restore mocks after each test
    restoreMocks: true
};

export default config;