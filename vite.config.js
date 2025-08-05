// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/prs/',        // Base URL for GitHub Pages (repo name or custom subfolder)
  build: {
    outDir: 'dist'      // Output directory (default is 'dist')
    // Optionally, set outDir to 'docs' if using the docs/ folder for GH Pages
  },
  // Optional: define aliases if needed (e.g., for imports from '/lib/' if using a vendor folder)
  // resolve: {
  //   alias: {
  //     '@reveal': '/lib/reveal.js' 
  //   }
  // }
});