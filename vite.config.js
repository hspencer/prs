// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/prs/',   // GitHub Pages subpath
  build: { outDir: 'dist' }
});