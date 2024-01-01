import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
});
