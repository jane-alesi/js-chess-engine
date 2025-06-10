/** @type {import('jest').Config} */
const config = {
  transform: {},
  // This is important for ES Modules support in Jest
  // It tells Jest to treat .js files as ES Modules
  // and to not transform them with Babel or similar.
  // This is necessary because our project uses 'type': 'module' in package.json
  // and imports/exports in our JavaScript files.
  moduleFileExtensions: ['js', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.js'],
  // If you have issues with imports, you might need to configure moduleNameMapper
  // For example, if you are importing from 'src/core/Board.js' directly
  // and Jest can't resolve it, you might need something like:
  // moduleNameMapper: {
  //   '^\.\./src/(.*)\.js$': '<rootDir>/src/$1.js',
  // },
};

export default config;
