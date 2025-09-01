// main.js

import Reveal from 'reveal.js/dist/reveal.esm.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
// import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';

import './node_modules/reveal.js/css/reveal.scss';
import './css/custom.scss';

const deck = new Reveal({
  // Opciones de la segunda inicialización
  hash: true,
  slideNumber: false,
  transition: 'fade',
  // Plugins de la primera inicialización
  plugins: [ Markdown, Zoom, Notes ]
});


deck.initialize().then(() => {
  // Monta el sketch de la diapositiva visible al inicio
  const current = deck.getCurrentSlide();
  if (current) mountP5In(current);

  // Define la función para montar/desmontar en la transición
  const onAfterSlideTransition = (event) => {
    if (event.previousSlide) {
      unmountP5In(event.previousSlide);
    }
    if (event.currentSlide) {
      mountP5In(event.currentSlide);
    }
  };

  // Asigna el listener al evento más fiable
  deck.on('slidetransitionend', onAfterSlideTransition);

  // Caso especial para cuando se sale de la vista general (overview)
  deck.on('overviewhidden', () => {
    const currentSlide = deck.getCurrentSlide();
    if (currentSlide) {
      mountP5In(currentSlide);
    }
  });
});