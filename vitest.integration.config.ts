import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/tests/integration/**/*.test.ts'],
    setupFiles: ['src/tests/integration/setup.ts'],
    testTimeout: 30000, // 30 seconds for network calls
    hookTimeout: 30000,
  },
});