/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Following Vue.js official testing recommendations:
// https://vuejs.org/guide/scaling-up/testing
export default defineConfig({
  plugins: [vue()],
  test: {
    // Enable global test APIs
    globals: true,
    
    // Use happy-dom for faster tests (recommended by Vue docs)
    environment: 'happy-dom',
    
    // Setup files for test configuration
    setupFiles: './src/test/setup.ts',
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.*',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/mockData/**',
        '**/types/**'
      ],
      // Coverage thresholds to ensure quality
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    
    // Test file patterns - tests live alongside source files
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    
    // Exclude files from tests
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Test timeout
    testTimeout: 10000,
    
    // Hook timeout
    hookTimeout: 10000,
    
    // Reporter configuration for better output
    reporters: ['default'],
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),
    },
  },
})
