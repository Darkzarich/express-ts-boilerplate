/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  // Tests are transpiled only; type checking is done by `npm run lint:types`
  transform: {
    '^.+\\.ts$': ['@swc/jest'],
  },
};
