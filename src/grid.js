import  {Pixel}  from "./pixel.js";

//POUR LA GRIDp

const zone1 = document.getElementById('grid-wrapper');
const canvas1 = document.getElementById("grid");
const ctx1 = canvas1.getContext("2d");

const rect1 = zone1.getBoundingClientRect();
canvas1.width  = rect1.width;
canvas1.height = rect1.height;


//POUR L'IMAGE 
const canvas2 = document.getElementById("grid-img");
const rect2 = canvas2.getBoundingClientRect()
const ctx2 = canvas2.getContext("2d");
canvas2.width  = rect1.width;
canvas2.height = rect1.height;
 




//faire la grid
//faire des loop embriqués - line - distance - style de la ligne
ctx1.strokeStyle = "lime";
ctx1.lineWidth = 2;


//grille
let spacingX = canvas1.width/15;
let spacingY = canvas1.width/15;
for(let i =0; i <16; i++ ){
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
//grille 

let cols = 40;
let rows = 40;
let cellSize = canvas2.width/cols;
let pixels = [];


function buildGrid(){
 for(let y = 0; y < rows; y++){
    for(let x = 0; x < cols; x++){
        let px = x * cellSize;
        let py = y * cellSize;
        //créer un nouveau pixel dans l'array ctx2.rect()
        let pixel = new Pixel(px,py,cellSize);
        //push mais trouver un autre truc bref
        pixels.push(pixel);
        };
    };
}

buildGrid();

// IMAGE TATOUAGE - quand tu n'a pas de balise <img>

let overlayImageData = null;

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

    p.color = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }
}

function renderGrid(){
    ctx2.clearRect(0, 0 ,canvas2.width, canvas2.height);
    for(let z = 0; z < pixels.length; z++){
        pixels[z].draw(ctx2);
    }
}

function drawTattooOnGrid(overlaySrc){
    const img = new Image();
    img.src = overlaySrc; 

    img.onload = ()=>{
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
        overlayImageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        apply();
        renderGrid();
    }
}
window.drawTattooOnGrid = drawTattooOnGrid;
//pour que ce soit utiliser dans main.js

// fonction récupérer les couleurs et appliquerx aux "pixels"








