## Presentation Deployment Guide

### Overview

This repository contains the source code for a web-based presentation built with [Vite](https://vitejs.dev/) and [Reveal.js](https://revealjs.com/). It is configured for a modern development experience and a straightforward, manual deployment process to GitHub Pages.

### Local Development

To work on the presentation on your local machine, follow these steps:

1. Clone the repository:

```vash
  git clone https://github.com/hspencer/prs.git
  cd prs
```
2. Install dependencies:
You will need Node.js (version 20 or higher).

```bash
  npm install
```
3. Start the development server:
This command starts a local server with hot-reloading, so changes you make to the code will be reflected instantly in your browser.

```bash
  npm run dev
```

The presentation will be available at the URL shown in your terminal (usually `http://localhost:5173`).

### Deployment to GitHub Pages

This project uses the `gh-pages` npm package for a simple, command-line based deployment.

#### One-Time Setup
Before your first deployment, you need to configure your GitHub repository:

1. Navigate to your repository on GitHub.
2. Go to the Settings tab.
3. In the left sidebar, click on Pages.
4. Under "Build and deployment", for the Source, select Deploy from a branch.
5. Under Branch, select `gh-pages` and `/ (root)` for the folder. Click Save.

(Note: The `gh-pages` branch will be created automatically on your first deployment, so you may need to perform this step after deploying for the first time).

### Deploying
Whenever you are ready to publish your changes, run the following command from your project's root directory:

```bash
npm run deploy
```

This command will automatically build the project and push the production-ready files to the gh-pages branch. GitHub Pages will then serve the site from that branch.

The live site is available at: http://herbertspencer.net/prs

### Key Configuration

- `vite.config.js`: The `base: '/prs/'` option is set to ensure all asset paths work correctly on the published sub-path. The `build.outDir: 'dist'` option tells Vite to place the build output in the standard `dist` folder.
- `package.json`: The `deploy` script (`gh-pages -d dist`) handles the process of pushing the dist folder to the gh-pages branch.