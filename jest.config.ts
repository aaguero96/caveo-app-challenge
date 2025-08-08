// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'src/dtos',
    'src/enums',
    'app.ts',
    'src/migrations',
    'src/config',
    'src/entities',
    'src/exceptions',
    'src/swagger',
    'src/__tests__',
    'src/main.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/src/__tests__/'],
};

export default config;
