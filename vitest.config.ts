import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist',
        'templates',
        'node_modules',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/test/**',
        'bin/**' // CLI entry point - mostly glue code
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'templates']
  }
});
