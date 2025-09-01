// public/p5/neural-network.js
// Self-boot, no launcher. Instancia única por página.

// Si tu build ya incluye p5 global (p5.js) por <script>, no necesitas import.
// Este archivo asume p5 disponible en window.

(function () {
  // Encontrar host: primero data-sketch="neural-network", luego #neural-network.
  function findHost() {
    return (
      document.querySelector('.p5-host[data-sketch="neural-network"]') ||
      document.getElementById('neural-network')
    );
  }

  function boot() {
    const hostEl = findHost();
    if (!hostEl || typeof window.p5 !== 'function') return;

    // Config por defecto (puedes sobreescribir vía data-attrs, p.ej. data-node-size="10")
    const cfg = {
      minLayers: num(hostEl.dataset.minLayers, 5),
      maxLayers: num(hostEl.dataset.maxLayers, 11),
      minNodes: num(hostEl.dataset.minNodes, 6),
      maxNodes: num(hostEl.dataset.maxNodes, 100),
      nodeSize: num(hostEl.dataset.nodeSize, 8.0),
      minConnectionStroke: num(hostEl.dataset.minConnectionStroke, 0.25),
      maxConnectionStroke: num(hostEl.dataset.maxConnectionStroke, 4.0),
      minConnectionAlpha: num(hostEl.dataset.minConnectionAlpha, 3),
      maxConnectionAlpha: num(hostEl.dataset.maxConnectionAlpha, 20),
      frameRate: num(hostEl.dataset.frameRate, 5)
    };

    let nodesPerLayer = [];
    let network = [];
    let nodeColor, nodeStrokeColor;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(hostEl.clientWidth, hostEl.clientHeight);
        p.frameRate(cfg.frameRate);
        nodeColor = p.color(200, 200, 255, 180);
        nodeStrokeColor = p.color(100);
        generateRandomNetwork();
      };

      p.draw = () => {
        p.clear();
        drawConnections();
        drawNodes();
      };

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

        for (let i = 0; i < numLayers; i++) {
          const layer = [];
          const numNodesInLayer = nodesPerLayer[i];
          const nodeSpacing = p.height / (numNodesInLayer + 1);
          const x = layerSpacing * (i + 1);
          for (let j = 0; j < numNodesInLayer; j++) {
            const y = nodeSpacing * (j + 1);
            layer.push({ x, y });
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
              p.stroke(200, 100, 0, sa);
              p.strokeWeight(sw);
              p.line(a.x, a.y, b.x, b.y);
            }
          }
        }
      }

      // Interacción mínima: [r] regenera, [espacio] vuelca config en consola
      p.keyPressed = () => {
        switch (p.key) {
          case 'r': generateRandomNetwork(); break;
          case ' ': exportConfig(); break;
        }
      };

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
        // eslint-disable-next-line no-console
        console.log(s);
      }

      // Redimensiona al tamaño del host
      p.windowResized = () => {
        p.resizeCanvas(hostEl.clientWidth, hostEl.clientHeight);
        generateNetworkLayout();
      };
    };

    // Crea la instancia y la deja colgada en el host (por si quieres tocarla luego)
    hostEl._p5Instance = new window.p5(sketch, hostEl);
  }

  function num(v, dflt) {
    const n = Number(v);
    return Number.isFinite(n) ? n : dflt;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();