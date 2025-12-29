import  Pixel  from "./pixel.js";

//POUR LA GRID

const zone1 = document.getElementById('grid-wrapper');
const canvas1 = document.getElementById("grid");
const ctx1 = canvas1.getContext("2d");

const rect1 = zone1.getBoundingClientRect();
canvas1.width  = rect1.width;
canvas1.height = rect1.height;


//POUR L'IMAGE 
const canvas2 = document.getElementById("grid-img");
const rect2 = canvas2.getBoundingClientRect()
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
canvas2.width  = rect1.width;
canvas2.height = rect1.height;
 

// === CANVAS BARRES (rect-bottom) ===
// HTML: <canvas class="rect-bottom"></canvas>

const canvas3 = document.querySelector(".rect-bottom");
const ctx3 = canvas3.getContext("2d");

// resize propre (à appeler au load + au resize)
function resizeBarsCanvas() {
  const rect3 = canvas3.getBoundingClientRect();
  canvas3.width  = Math.floor(rect3.width);
  canvas3.height = Math.floor(rect3.height);
}

resizeBarsCanvas();
window.addEventListener("resize", resizeBarsCanvas);




// grille statique (mise en cache) + coins animés
const gridStatic = document.createElement("canvas");
gridStatic.width = canvas1.width;
gridStatic.height = canvas1.height;
const gridStaticCtx = gridStatic.getContext("2d");

function drawGridLines(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 2;

  const spacingX = w / 15;
  const spacingY = w / 15;

  for (let i = 0; i < 17; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * spacingY);
    ctx.lineTo(w, i * spacingY);
    ctx.stroke();
  }

  for (let j = 0; j < 17; j++) {
    ctx.beginPath();
    ctx.moveTo(j * spacingX, 0);
    ctx.lineTo(j * spacingX, h);
    ctx.stroke();
  }
}

drawGridLines(gridStaticCtx, canvas1.width, canvas1.height);

function drawCorners(ctx, t) {
  const cycle = 1.4;
  const phase = (t * 3) % cycle;
  if (phase < 0.12) {
    ctx.fillStyle = "rgb(255, 220, 0)";
  } else {
    const fadeT = Math.min(1, (phase - 0.12) / (cycle - 0.12));
    const ease = fadeT * fadeT * (3 - 2 * fadeT);
    const g = Math.floor(220 * (1 - ease));
    ctx.fillStyle = `rgb(255, ${g}, 0)`;
  }

  ctx.beginPath();
  ctx.roundRect(0, 0, 50, 50, [0, 0, 50, 0]);
  ctx.roundRect(0, canvas1.height - 50, 50, 50, [0, 50, 0, 0]);
  ctx.roundRect(canvas1.width - 50, 0, 50, 50, [0, 0, 0, 50]);
  ctx.roundRect(canvas1.width - 50, canvas1.height - 50, 50, 50, [50, 0, 0, 0]);
  ctx.fill();
}

function animateCorners(now) {
  const t = now / 1000;
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx1.drawImage(gridStatic, 0, 0);
  drawCorners(ctx1, t);
  requestAnimationFrame(animateCorners);
}

requestAnimationFrame(animateCorners);


//RASTERISATION IMAGE
//grille base

let cols = 400;
let rows = 400;
let cellSize = canvas2.width/cols;
let pixels = [];


function buildGrid(){
 for(let y = 0; y < rows; y++){
    for(let x = 0; x < cols; x++){
        let px = x * cellSize;
        let py = y * cellSize;
        //créer un nouveau pixel dans l'array ctx2.rect()
        let pixel = new Pixel(px,py,cellSize);
        pixel.row = y;
        //push mais trouver un autre truc bref
        pixels.push(pixel);
        };
    };
}

buildGrid();


// COULEUR DE PIXEL PAR RAPPORT à L'IMAGE
let overlayImageData = null;

//ID DES COULEURS
let BLUE_ID = 0;
let GREEN_ID = 1;
let RED_ID = 2;
let WHITE_ID = 3;

//PALETTE RGB
const PALETTE =[
  [0,0,255],     //BLUE
  [0,255,0],     //GREEN
  [255,0,0],     //RED
  [255,255,255], //WHITE
];

//VISIBILITE DES COULEURS 
const visible = [true, true, true, true];

function apply() {
  if (!overlayImageData) return; // return = on sort de la fonction 

  const { width, data } = overlayImageData; // récupérer deux infos de ImageData

  for (let k = 0; k < pixels.length; k++) {
    const p = pixels[k];
    // lire la couleur qui se trouve au centre du carré 
    const readX = Math.floor(p.x + p.size / 2);
    const readY = Math.floor(p.y + p.size / 2);
    // convertir la position ci-dessus en index dans le tableau data
    //readY * width + readX = “numéro du pixel” si on compte ligne par ligne
    //* 4 parce que chaque pixel prend 4 cases (R,G,B,A)
    const i = (readY * width + readX) * 4;
    //p.color = [data[i], data[i + 1], data[i + 2], data[i + 3]];

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    p.color = [r, g, b, a];
    // si transparent, on peut ignorer
    p.colorId = (a === 0) ? null : closestColorId(r, g, b);
  }


}

//PERMET D'AVOIR DU RANGE DANS LE CHOIX DES COULEURS
function distSqRGB(r, g, b, ref) {
  const dr = r - ref[0];
  const dg = g - ref[1];
  const db = b - ref[2];
  return dr * dr + dg * dg + db * db;
}

function closestColorId(r, g, b) {
  let bestId = 0;
  let bestD = Infinity;

  for (let id = 0; id < PALETTE.length; id++) {
    const d = distSqRGB(r, g, b, PALETTE[id]);
    if (d < bestD) {
      bestD = d;
      bestId = id;
    }
  }
  return bestId; // 0..3
}


function renderGrid() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  for (let z = 0; z < pixels.length; z++) {
    const p = pixels[z];

    if (p.colorId === null) continue;           // transparent
    if (!visible[p.colorId]) continue;          // masqué

    p.draw(ctx2);
  }
}
//fonction animation affichage image

//CACHER DES PIXEL 

function hidePixel(colorID){
  visible[colorID] = !visible[colorID];
  renderGrid();
}
window.hidePixel = hidePixel;
    
// Animation reveal (ligne par ligne) --
let revealRow = 0;
let animId = null;
let rowsPerFrame = 1; // <- mets 1 ici

function displayImage(color) {
  revealRow = 0;
  if (animId) cancelAnimationFrame(animId);

  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  // 👇 affiche la barre à 0% au départ
  p = 0;
  progressBars(p);

  function step() {
    for (let r = 0; r < rowsPerFrame; r++) {
      if (revealRow >= rows) break;

      const start = revealRow * cols;
      for (let x = 0; x < cols; x++) {
        const pxx = pixels[start + x];

        if (pxx.colorId === null) continue;
        if (!visible[pxx.colorId]) continue;

        pxx.draw(ctx2);
      }

      revealRow++;

      // 👇 MAJ progression après avoir révélé une ligne
      p = revealRow / rows;
    }

    // 👇 redessine la barre à chaque frame
    progressBars(p);

    if (revealRow < rows) {
      animId = requestAnimationFrame(step);
    } else {
      animId = null;
      // optionnel: forcer 100% pile
      progressBars(1);
    }
  }

  step();
}

apply();

function drawTattooOnGrid(overlaySrc){
    const img = new Image();
    img.src = overlaySrc; 

    img.onload = ()=>{
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
        overlayImageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        apply();
        displayImage(); // ✅ au lieu de renderGrid()
    }
}
window.drawTattooOnGrid = drawTattooOnGrid;

///// RECTANGLE PROGRESSION 

let p = 0;

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function progressBars(progress) {
  const w = canvas3.width;
  const h = canvas3.height;

  ctx3.clearRect(0, 0, w, h);

  const gap  = Math.floor(h * 0.01);
  const count = 3;

  const barW = w;
  const usableH = Math.max(0, h - gap * (count - 1));
  const barH = Math.max(6, Math.floor(usableH / count));

  const progresses = Array.isArray(progress)
    ? progress.map(clamp01)
    : [clamp01(progress), clamp01(progress), clamp01(progress)];

  const railStyle = "rgba(0, 0, 0, 1)";
  const fillStyles = ["white", "white", "white"];

  for (let i = 0; i < count; i++) {
    const x0 = 0;
    const y0 = i * (barH + gap);

    ctx3.fillStyle = railStyle;
    ctx3.fillRect(x0, y0, barW, barH);

    const fillW = Math.floor(barW * progresses[i]);
    ctx3.fillStyle = fillStyles[i];
    ctx3.fillRect(x0, y0, fillW, barH);
  }
}
