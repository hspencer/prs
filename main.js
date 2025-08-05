// main.js
import Reveal   from './node_modules/reveal.js/dist/reveal.esm.js';
import Markdown from './node_modules/reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from './node_modules/reveal.js/plugin/highlight/highlight.esm.js';
import Zoom     from './node_modules/reveal.js/plugin/zoom/zoom.esm.js';
import Notes    from './node_modules/reveal.js/plugin/notes/notes.esm.js';

const deck = new Reveal({
  controls:    true,
  progress:    true,
  slideNumber: 'c/t',
  transition:  'slide',
  plugins:     [ Markdown, Highlight, Zoom, Notes ]
});

deck.initialize();