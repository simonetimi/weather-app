import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  base: '/weather-app/',
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
  plugins: [ViteImageOptimizer({})],
});
