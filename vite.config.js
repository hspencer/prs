// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Establece la ruta base pública para el proyecto. Esto es crucial para el
  // despliegue en GitHub Pages en una subruta. Dado que el sitio estará en
  // 'herbertspencer.net/prs', la ruta base debe ser '/prs/'.
  base: '/prs/',

  build: {
    // Especifica el directorio de salida para la compilación. GitHub Pages está
    // configurado para servir desde la carpeta 'docs', por lo que cambiamos el
    // valor predeterminado de 'dist' a 'docs'.
    outDir: 'docs',

    // Asegura que el directorio de salida se vacíe en cada compilación.
    // Esta es una buena práctica para evitar que archivos antiguos permanezcan
    // en el despliegue y causen comportamientos inesperados.
    emptyOutDir: true
  }
});