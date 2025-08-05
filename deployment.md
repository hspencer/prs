# Deployment Guide

This document details how to serve and run your Reveal.js presentation in a local environment, including speaker notes and full plugin support. All instructions assume you have already installed Reveal.js via `npm install reveal.js` and have your `index.html` and `main.js` in place.

## 1. Basic File Open

You may open `index.html` in your browser without a server.  
- **Procedure**:  
  1. Locate `index.html` in your file system.  
  2. Double‑click or drag into your browser window.  
- **Limitations**:  
  - External Markdown files will **not** load.  
  - Speaker notes will **not** appear.  
  - Some plugins may fail due to the `file://` protocol.

## 2. Local HTTP Server

To enable full functionality—external Markdown, speaker notes, plugins—you must serve files over HTTP.

### 2.1 Reveal.js Development Server

If you have the Reveal.js repository cloned:
```bash
cd path/to/reveal.js
npm install            # first time only
npm start              # serves at http://localhost:8000
```
Then navigate to `http://localhost:8000/your-project-folder/index.html`.

### 2.2 Node.js Static Server

Using the `serve` package:
```bash
npm install --global serve
serve .                # serves current directory at http://localhost:3000
```

### 2.3 Python Built‑in Server

Python 3 includes a simple HTTP server:
```bash
cd path/to/your/project
python3 -m http.server 8000
```
Open `http://localhost:8000/` in a modern browser.

## 3. Speaker Notes

With the Notes plugin enabled:
- Press the **S** key during presentation to open speaker notes in a separate window.
- Ensure your browser allows pop‑ups for the notes window.

## 4. Verification

1. Start your chosen server.  
2. Open the correct local URL in Chrome, Firefox, or Safari.  
3. Use arrow keys or on‑screen controls to advance slides.  
4. Confirm external Markdown loads (if used) and speaker notes appear.

## 5. Deploy All

```bash
npm install
npm run build         # produces docs/ with built files
npm run preview       # locally preview production build
```
