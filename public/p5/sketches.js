// ========================================================================
// GESTOR DE INSTANCIAS P5.JS PARA REVEAL.JS
// ========================================================================

const P5_REGISTRY = new Map();

/**
 * Monta todos los sketches de p5.js dentro de una sección/diapositiva.
 * Se debe llamar cuando la diapositiva se vuelve visible.
 * @param {HTMLElement} sectionEl El elemento de la sección de Reveal.
 */
function mountP5In(sectionEl) {
  const hosts = sectionEl.querySelectorAll('.p5-host');
  hosts.forEach(host => {
    // Si ya existe una instancia para este host, no hagas nada.
    if (P5_REGISTRY.has(host)) return;

    const sketchType = host.dataset.sketch;
    let factory = null;

    // Selector de la "fábrica" de sketches
    if (sketchType === 'chronology') {
      factory = chronologySketchFactory(host);
    } else if (sketchType === 'neural-network') {
      factory = neuralNetworkSketchFactory(host);
    }

    if (!factory) {
      console.warn(`No p5 factory found for sketch type: ${sketchType}`);
      return;
    }

    // Crea la nueva instancia y la guarda en el registro.
    const instance = new p5(factory, host);
    P5_REGISTRY.set(host, instance);
  });
}

/**
 * Desmonta y limpia todos los sketches de p5.js de una sección.
 * Se debe llamar cuando la diapositiva se oculta.
 * @param {HTMLElement} sectionEl El elemento de la sección de Reveal.
 */
function unmountP5In(sectionEl) {
  const hosts = sectionEl.querySelectorAll('.p5-host');
  hosts.forEach(host => {
    const instance = P5_REGISTRY.get(host);
    if (instance) {
      if (typeof instance.remove === 'function') {
        instance.remove(); // Método de p5.js para limpiar todo.
      }
      P5_REGISTRY.delete(host);
      host.innerHTML = ''; // Limpia el contenedor por si acaso.
    }
  });
}

// ========================================================================
// FÁBRICA DE SKETCH #1: CHRONOLOGY
// (Sin cambios, se mantiene como referencia)
// ========================================================================

function chronologySketchFactory(parentEl) {
  return function(p) {
    const startTime = 1990;
    const endTime = 2030;
    let currentYear = startTime;
    let thisYear;
    const yearEvents = { 1990: "WWW", 1991: "Linux Kernel", 1992: "PCs, SMS", 1993: "Web browser", 1994: "E-Commerce", 1995: "Windows 95, Netscape", 1996: "GUI", 1997: "Google PageRank", 1998: "MP3, ICQ", 1999: "P2P: Napster", 2000: "Dot-com bubble", 2001: "Wikipedia", 2002: "Bluetooth", 2003: "Social media, VoIP", 2004: "Facebook, APIs", 2005: "YouTube, Maps", 2006: "Twitter, AWS", 2007: "Multitouch: iPhone", 2008: "Android, iOS, Symbian", 2009: "PayPal, Bitcoin", 2010: "iPad", 2011: "Siri", 2012: "Deep Learning", 2013: "Wearable Computing", 2014: "Oculus Rift: VR", 2015: "TensorFlow · CRISPR", 2016: "Pokémon GO: AR", 2017: "AI: Transformers", 2018: "GDPR", 2019: "5G, 4G LTE", 2020: "COVID-19, GPT-3", 2021: "NFTs, Metaverse", 2022: "Quantum Computing", 2023: "Custom GPTs", 2024: "AI Agents", 2025: "AGI?" };
    const fadeValues = {};
    let hostW, hostH;

    p.setup = function() {
      hostW = parentEl.clientWidth;
      hostH = parentEl.clientHeight;
      const c = p.createCanvas(hostW, hostH);
      c.parent(parentEl);
      thisYear = new Date().getFullYear();
      for (const y in yearEvents) fadeValues[y] = 255;
      p.textFont('Lexend');
    };

    p.windowResized = function() {
      hostW = parentEl.clientWidth;
      hostH = parentEl.clientHeight;
      p.resizeCanvas(hostW, hostH);
    };

    p.draw = function() {
      p.clear();
      drawExponentialGraph();
      displayYear();
      drawLegends();
    };

    function drawExponentialGraph() {
      p.noFill(); p.stroke(166, 49, 23); p.beginShape();
      for (let x = 0; x <= currentYear - startTime; x += 0.02) {
        const y = Math.pow(2, x / 5);
        p.vertex(
          p.map(x + startTime, startTime, endTime, 0, p.width),
          p.map(y, 1, Math.pow(2, (endTime - startTime) / 5), p.height, 0)
        );
      }
      p.endShape();
    }

    function displayYear() {
      p.noStroke(); p.fill(190); p.textSize(52);
      if (currentYear < thisYear) {
        p.text(p.nf(Math.floor(currentYear), 4), 10, 52);
      } else {
        p.text(thisYear + "…", 10, 52);
      }
      if (currentYear < endTime) {
        currentYear += (endTime - startTime) / Math.max(1, p.width);
      }
    }

    function drawLegends() {
      p.noStroke(); p.textSize(16);
      for (const y in yearEvents) {
        const yi = parseInt(y, 10);
        if (currentYear >= yi) {
          p.fill(fadeValues[y]);
          const xPos = p.map(yi, startTime, endTime, 0, p.width);
          const yPos = p.height * 0.9 - (yi % 10) * 20;
          p.text(yearEvents[y], xPos, yPos);
          p.push();
          p.translate(xPos, yPos);
          p.rotate(-p.HALF_PI);
          p.textFont("Lexend");
          p.textSize(10);
          p.fill(166, 49, 23, 130);
          p.text(yi, 15, 9);
          p.pop();
          if (fadeValues[y] > 10) fadeValues[y]--;
        }
      }
    }
  };
}

// ========================================================================
// FÁBRICA DE SKETCH #2: NEURAL NETWORK (REFACTORIZADO)
// ========================================================================

function neuralNetworkSketchFactory(parentEl) {
  // Helper para parsear números desde data-attributes
  function num(v, dflt) {
    const n = Number(v);
    return Number.isFinite(n) ? n : dflt;
  }

  // La fábrica devuelve la función del sketch que p5.js utilizará
  return function(p) {
    // Configuración leída desde los data-attributes del elemento anfitrión (parentEl)
    const cfg = {
      minLayers: num(parentEl.dataset.minLayers, 5),
      maxLayers: num(parentEl.dataset.maxLayers, 11),
      minNodes: num(parentEl.dataset.minNodes, 6),
      maxNodes: num(parentEl.dataset.maxNodes, 30),
      nodeSize: num(parentEl.dataset.nodeSize, 4.0),
      minConnectionStroke: num(parentEl.dataset.minConnectionStroke, 0.25),
      maxConnectionStroke: num(parentEl.dataset.maxConnectionStroke, 4.0),
      minConnectionAlpha: num(parentEl.dataset.minConnectionAlpha, 3),
      maxConnectionAlpha: num(parentEl.dataset.maxConnectionAlpha, 30),
      frameRate: num(parentEl.dataset.frameRate, 5)
    };

    let nodesPerLayer = [];
    let network = [];
    let nodeColor;

    p.setup = () => {
      p.createCanvas(parentEl.clientWidth, parentEl.clientHeight);
      p.frameRate(cfg.frameRate);
      nodeColor = p.color(255, 67, 0, 180);
      generateRandomNetwork();
    };

    p.draw = () => {
      p.clear();
      drawConnections();
      drawNodes();
    };

    p.windowResized = () => {
      p.resizeCanvas(parentEl.clientWidth, parentEl.clientHeight);
      generateNetworkLayout(); // Regenera layout para el nuevo tamaño
    };

    // Interacción mínima: [r] regenera, [espacio] vuelca config en consola
    p.keyPressed = () => {
      switch (p.key) {
        case 'r':
          generateRandomNetwork();
          break;
        case ' ':
          exportConfig();
          break;
      }
    };

    // ---- Lógica interna del sketch (sin cambios) ----

    function generateRandomNetwork() {
      nodesPerLayer = [];
      const numLayers = p.floor(p.random(cfg.minLayers, cfg.maxLayers + 1));
      for (let i = 0; i < numLayers; i++) {
        const numNodes = p.floor(p.random(cfg.minNodes, cfg.maxNodes + 1));
        nodesPerLayer.push(numNodes);
      }
      generateNetworkLayout();
    }

    function generateNetworkLayout() {
    network = [];
    const numLayers = nodesPerLayer.length;
    const layerSpacing = p.width / (numLayers + 1);
    const margin = 100; // Tu margen vertical en píxeles

    for (let i = 0; i < numLayers; i++) {
        const layer = [];
        const numNodesInLayer = nodesPerLayer[i];
        // El espacio se calcula sobre la altura total disponible
        const nodeSpacing = p.height / (numNodesInLayer + 1);
        const x = layerSpacing * (i + 1);

        for (let j = 0; j < numNodesInLayer; j++) {
        // 1. Calcula la posición 'y' ideal sin margen
        const idealY = nodeSpacing * (j + 1);
        
        // 2. Mapea esa posición al nuevo rango con margen
        //    p.map(valor, rango_original_inicio, rango_original_fin, rango_nuevo_inicio, rango_nuevo_fin)
        const mappedY = p.map(idealY, 0, p.height, margin, p.height - margin);

        // 3. Añade el nodo con la propiedad 'y' para que las otras funciones lo encuentren
        layer.push({ x: x, y: mappedY });
        }
        network.push(layer);
    }
    }

    function drawNodes() {
      p.noStroke();
      p.fill(nodeColor);
      for (const layer of network) {
        for (const node of layer) {
          p.circle(node.x, node.y, cfg.nodeSize);
        }
      }
    }

    function drawConnections() {
      for (let i = 0; i < network.length - 1; i++) {
        const current = network[i];
        const next = network[i + 1];
        for (const a of current) {
          for (const b of next) {
            const sw = p.random(cfg.minConnectionStroke, cfg.maxConnectionStroke);
            const sa = p.random(cfg.minConnectionAlpha, cfg.maxConnectionAlpha);
            p.stroke(254, 129, 112, sa);
            p.strokeWeight(sw);
            p.line(a.x, a.y, b.x, b.y);
          }
        }
      }
    }

    function exportConfig() {
      const s = `
// --- Config Export ---
minLayers=${cfg.minLayers};
maxLayers=${cfg.maxLayers};
minNodes=${cfg.minNodes};
maxNodes=${cfg.maxNodes};
nodeSize=${cfg.nodeSize.toFixed(2)};
minConnectionStroke=${cfg.minConnectionStroke.toFixed(2)};
maxConnectionStroke=${cfg.maxConnectionStroke.toFixed(2)};
minConnectionAlpha=${cfg.minConnectionAlpha.toFixed(0)};
maxConnectionAlpha=${cfg.maxConnectionAlpha.toFixed(0)};
`;
      console.log(s);
    }
  };
}