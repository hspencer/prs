// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@reveal': path.resolve(__dirname, 'node_modules/reveal.js/src/css')
    }
  },
  base: '/prs/',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
});