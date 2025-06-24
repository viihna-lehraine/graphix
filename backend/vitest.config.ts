import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json'],
      reportsDirectory: './tests/coverage',
      exclude: ['dist', 'knex-dist', 'migrations', 'node_modules'],
      all: true
    }
  }
});
