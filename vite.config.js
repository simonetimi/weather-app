import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    base: '/weather-app/',
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
});
