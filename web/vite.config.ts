/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The API is served by the Rust server (../server). During `npm run dev` it is proxied.
export default defineConfig({
  plugins: [react()],
  base: './', // relative URLs: works behind a reverse proxy sub-path
  build: { outDir: 'dist', emptyOutDir: true, sourcemap: false, chunkSizeWarningLimit: 1600 },
  server: { proxy: { '/api': 'http://127.0.0.1:8080' } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**'],
      reporter: ['text-summary', 'text']
    }
  }
});
