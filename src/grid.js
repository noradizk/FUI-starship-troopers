//POUR LA GRID

const zone1 = document.getElementById('grid-wrapper');
const canvas1 = document.getElementById("grid");
const ctx1 = canvas1.getContext("2d");

const rect1 = zone1.getBoundingClientRect();
canvas1.width  = rect1.width;
canvas1.height = rect1.height;
let spacingY = canvas1.height/15;
let spacingX = canvas1.width/15;


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


// IMAGE TATOUAGE - quand tu n'a pas de balise <img>
function drawTattooOnGrid(overlaySrc){
    const img = new Image();
    img.src = overlaySrc; 

    img.onload = ()=>{
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
    }
}
window.drawTattooOnGrid = drawTattooOnGrid;
//pour que ce soit utiliser dans main.js