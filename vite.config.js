import { defineConfig } from 'vite';

export default defineConfig({
  base: '/weather-app/',
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
});
