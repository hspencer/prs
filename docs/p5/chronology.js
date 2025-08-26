
const P5_REGISTRY = new Map();

function chronologySketchFactory(parentEl){
  return function (p) {
    const startTime = 1990;
    const endTime = 2030;
    let currentYear = startTime;
    let thisYear;
    const yearEvents = {
      1990: "WWW",
      1991: "Linux Kernel",
      1992: "PCs, SMS",
      1993: "Web browser",
      1994: "E-Commerce",
      1995: "Windows 95, Netscape",
      1996: "GUI",
      1997: "Google PageRank",
      1998: "MP3, ICQ",
      1999: "P2P: Napster",
      2000: "Dot-com bubble",
      2001: "Wikipedia",
      2002: "Bluetooth",
      2003: "Social media, VoIP",
      2004: "Facebook, APIs",
      2005: "YouTube, Maps",
      2006: "Twitter, AWS",
      2007: "Multitouch: iPhone",
      2008: "Android, iOS, Symbian",
      2009: "PayPal, Bitcoin",
      2010: "iPad",
      2011: "Siri",
      2012: "Deep Learning",
      2013: "Wearable Computing",
      2014: "Oculus Rift: VR",
      2015: "TensorFlow · CRISPR",
      2016: "Pokémon GO: AR",
      2017: "AI: Transformers",
      2018: "GDPR",
      2019: "5G, 4G LTE",
      2020: "COVID-19, GPT-3",
      2021: "NFTs, Metaverse",
      2022: "Quantum Computing",
      2023: "Custom GPTs",
      2024: "AI Agents",
      2025: "AGI?"
    };
    const fadeValues = {};
    let hostW, hostH;

    p.setup = function () {
      hostW = parentEl.clientWidth || 960;
      hostH = parentEl.clientHeight || 420;
      const c = p.createCanvas(hostW, hostH);
      c.parent(parentEl);
      thisYear = new Date().getFullYear();
      for (const y in yearEvents) fadeValues[y] = 255;
      p.textFont('Alegreya Sans, system-ui');
    };

    p.windowResized = function () {
      // importante: re-calcular dimensiones del host
      hostW = parentEl.clientWidth;
      hostH = parentEl.clientHeight;
      p.resizeCanvas(hostW, hostH);
    };

    p.draw = function () {
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

/** Monta p5 en todos los .p5-host dentro de una sección */
function mountP5In(sectionEl){
  const hosts = sectionEl.querySelectorAll('.p5-host');
  hosts.forEach(host=>{
    if (P5_REGISTRY.has(host)) return;
    const type = host.dataset.sketch;
    let factory = null;
    if (type === 'chronology') factory = chronologySketchFactory(host);
    if (!factory) return;
    const instance = new p5(factory, host);
    P5_REGISTRY.set(host, instance);
  });
}

/** Desmonta p5 de esa sección */
function unmountP5In(sectionEl){
  const hosts = sectionEl.querySelectorAll('.p5-host');
  hosts.forEach(host=>{
    const inst = P5_REGISTRY.get(host);
    if (inst && inst.remove) inst.remove();
    P5_REGISTRY.delete(host);
    host.innerHTML = '';
  });
}