// main.js
import 'reveal.js/docs/reveal.css';
import 'reveal.js/docs/theme/black.css';        
import 'reveal.js/plugin/highlight/monokai.css';

import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js';

// Initialize Reveal with desired plugins and options:
Reveal.initialize({
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  transition: 'slide',
  plugins: [ Markdown, Highlight, Notes, Zoom ]
});