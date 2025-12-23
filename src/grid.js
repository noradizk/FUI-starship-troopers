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




//faire la grid
//faire des loop embriqués - line - distance - style de la ligne
ctx1.strokeStyle = "lime";
ctx1.lineWidth = 2;


//grille
let spacingX = canvas1.width/15;
let spacingY = canvas1.width/15;
for(let i =0; i <17; i++ ){
    ctx1.beginPath();
    ctx1.moveTo(0, i*spacingY)
    ctx1.lineTo(canvas1.width, i*spacingY)
    ctx1.stroke();
}
    for(let j = 0; j <17; j++){
        ctx1.beginPath();
        ctx1.moveTo(j*spacingX,0);
        ctx1.lineTo(j*spacingX, canvas1.height);
        ctx1.stroke();
    }


//rectangle angles
ctx1.fillStyle = "red"; 
ctx1.beginPath();
ctx1.roundRect(0, 0, 50, 50, [0, 0, 50, 0]);
ctx1.roundRect(0, canvas1.height-50, 50, 50, [0, 50, 0, 0]);
ctx1.roundRect(canvas1.width-50, 0, 50, 50, [0, 0, 0, 50]);
ctx1.roundRect(canvas1.width-50, canvas1.height-50,50, 50, [50, 0, 0, 0]);
ctx1.fill();


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

  // on efface UNE fois au début
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  function step() {
    // dessine seulement la/les nouvelles lignes
    for (let r = 0; r < rowsPerFrame; r++) {
      if (revealRow >= rows) break;

      const start = revealRow * cols;
      for (let x = 0; x < cols; x++) {
        const p = pixels[start + x];

        if (p.colorId === null) continue;      // transparent
        if (!visible[p.colorId]) continue;     // couleur masquée

        p.draw(ctx2);
      }

      revealRow++;
    }

    if (revealRow < rows) {
      animId = requestAnimationFrame(step);
    } else {
      animId = null;
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


///// RECTANGLE PRGRESSION 



