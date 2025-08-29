// main.js


// Import Reveal’s ESM build
import Reveal from 'reveal.js/dist/reveal.esm.js';

// Importar los plugins deseados.
// Nótese el '.esm.js' para una correcta integración con el sistema de módulos de Vite.
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';


// Importa tu SCSS (Vite compilará automáticamente)
// main.js (arriba, junto a los plugins)
import 'reveal.js/plugin/highlight/monokai.css';
import './node_modules/reveal.js/css/reveal.scss';
import './css/custom.scss';


// Inicializar Reveal.js, pasando los plugins que se deseen utilizar en un array.
const deck = new Reveal({
   plugins: [ Markdown, Zoom, Notes, Highlight ]
});

document.addEventListener('DOMContentLoaded', () => {
  const deck = new Reveal({
    hash: true,
    slideNumber: false,
    transition: 'fade'
  });

  deck.initialize().then(() => {
    // Mount whatever is visible now
    const current = deck.getCurrentSlide();
    if (current) mountP5In(current);

    // Safer to mount after transition completes (sizes are final)
    const onAfter = (e) => {
      if (e.previousSlide) unmountP5In(e.previousSlide);
      if (e.currentSlide)  mountP5In(e.currentSlide);
    };

    // v4: 'slidetransitionend' is the most reliable for size
    if (typeof deck.on === 'function') {
      deck.on('slidetransitionend', onAfter);
      deck.on('overviewhidden', e => { const s = deck.getCurrentSlide(); if (s) mountP5In(s); });
    } else {
      deck.addEventListener('slidetransitionend', onAfter);
      deck.addEventListener('overviewhidden', () => {
        const s = deck.getCurrentSlide(); if (s) mountP5In(s);
      });
    }
  });
});