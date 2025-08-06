// main.js

// 1. Importar la librería principal de Reveal.js
import Reveal from 'reveal.js';

// 2. Importar los plugins deseados.
// Nótese el '.esm.js' para una correcta integración con el sistema de módulos de Vite.
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';

// 3. Importar los estilos principales de Reveal.js.
import 'reveal.js/dist/reveal.css';

// 4. Importar el tema deseado. Se ha cambiado a 'serif' según lo solicitado.
import 'reveal.js/dist/theme/serif.css';

// 5. Opcional: Importar un tema para el resaltado de sintaxis si se usa el plugin Highlight.
import 'reveal.js/plugin/highlight/monokai.css';

// 6. Inicializar Reveal.js, pasando los plugins que se deseen utilizar en un array.
const deck = new Reveal({
   plugins: [ Markdown, Zoom, Notes, Highlight ]
});

deck.initialize({
  // Opcional: Configuración adicional aquí
});