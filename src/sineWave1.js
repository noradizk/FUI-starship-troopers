
// LASER 1

const limit = document.querySelector('.laser-wrapper');
const canvas1 = document.getElementById("laser1");
const ctx1 = canvas1.getContext("2d");
const rect1 = limit.getBoundingClientRect();

// LASER 2
const canvas2 = document.getElementById("laser2");
const ctx2 = canvas2.getContext("2d");




// LASER 3

const canvas3 = document.getElementById("laser3");
const ctx3 = canvas3.getContext("2d");


// LASER 4

const canvas4= document.getElementById("laser4");
const ctx4 = canvas4.getContext("2d");



// Une seule logique de resize
function resizeAll() {
  const rect = canvas1.parentElement.getBoundingClientRect();

  canvas1.width  = rect.width;
  canvas1.height = rect.height;

  canvas2.width  = rect.width;
  canvas2.height = rect.height;

  canvas3.width  = rect.width;
  canvas3.height = rect.height;

  canvas4.width  = rect.width;
  canvas4.height = rect.height;

    width = canvas1.width;
    height = canvas1.height;
}

//sinusoidale
//ressource 
// https://gist.github.com/gkhays/e264009c0832c73d5345847e673a64ab

let t1 = 0;
let t2 = 0;
let t3 = 0;
let t4 = 0;
let width;
let height;

let paused = [false, false, false, false];

canvas1.addEventListener("click", () => paused[0] = !paused[0]);
canvas2.addEventListener("click", () => paused[1] = !paused[1]);
canvas3.addEventListener("click", () => paused[2] = !paused[2]);
canvas4.addEventListener("click", () => paused[3] = !paused[3]);

function drawFlatLine(ctx, color) {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
}



function plotSine1(ctx1, t1){
  console.log("click canvas1")
    //const scale = 20
      if (paused[0]) {
    drawFlatLine(ctx1, "rgba(112, 112, 116, 1)");
    return;
  }
    ctx1.beginPath();
    ctx1.lineWidth = 2;
    ctx1.strokeStyle = "rgb(66,44,255)";
    let x = 0;
    let y = 0;
    let amplitude = height/2;
    let frequency = 20;

    while (x<width){
        y= height/2 + amplitude * Math.sin(x/frequency + t1);
        ctx1.lineTo(x,y);
        x = x + 1 ;
        // x parcourt la largeur du canvas (boucle)
        // y = sin(x) centrée au milieu (height/2)
        // amplitude = hauteur de la vague
    // frequency = nombre de vagues (plus grand = plus étiré)
    }
    ctx1.stroke();
}

function plotSine2(ctx2, t2,){
          if (paused[1]) {
    drawFlatLine(ctx2, "rgba(112, 112, 116, 1)");
    return;
  }

    ctx2.beginPath();
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = "green";
    let y = 0;
    let x = 0;
    let amplitude = height/2;
    let frequency = 5;

    while(x<width){
        y = height/2 + amplitude * Math.sin(x/frequency  + t2);
        ctx2.lineTo(x,y);
        x = x + 1;

    }
    ctx2.stroke();

}

function plotSine3(ctx3, t3) {
          if (paused[2]) {
    drawFlatLine(ctx3, "rgba(112, 112, 116, 1)");
    return;
  }
    ctx3.lineWidth = 2;
    ctx3.strokeStyle = "red";

    let amplitude = height / 2;
    let frequency = 50;
    const phases = [0, 2]; // tableau de phases

    for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];

        ctx3.beginPath();

        // premier point (x = 0)
        let x = 0;
        let y = height / 2 + amplitude * Math.sin(x / frequency + t3 + phase);
        ctx3.moveTo(x, y);

        // on balaye x
        for (x = 1; x < width; x++) {
            y = height / 2 + amplitude * Math.sin(x / frequency + t3 + phase);
            ctx3.lineTo(x, y);
        }

        ctx3.stroke();
    }
}



function plotSine4(ctx4, t4){
          if (paused[3]) {
    drawFlatLine(ctx4, "rgba(112, 112, 116, 1)");
    return;
  }
    ctx4.lineWidth = 2;
    ctx4.strokeStyle = "white";
    let amplitude = height/2;
    let frequency = 50;
    const phases = [0, 2];

/*     while(x<width){
        y = height/2 + amplitude * Math.sin(x/frequency + t4);
        ctx4.lineTo(x,y);
        x = x + 1;
    } */
   
    for(let i = 0; i< phases.length; i++){
        const phase = phases[i];

        ctx4.beginPath(); //nouveau trait pour cette vague

        //premier point(x=0)
        let x = 0;
        let y = height / 2 + amplitude * Math.sin(x / frequency + t4 + phase);
        ctx4.moveTo(x, y);

         for (x = 1; x < width; x++) {
         y = height / 2 + amplitude * Math.sin(x / frequency + t4 + phase);
         ctx4.lineTo(x, y);
        }
      ctx4.stroke();
    }

}





function draw(){
    ctx1.clearRect(0, 0 ,width, height);
    plotSine1(ctx1, t1);
    if(paused[0]){
        t1}else{
        t1 += 0.8;
        }
    

    ctx2.clearRect(0,0, width, height);
    plotSine2(ctx2, t2);
        if(paused[1]){
        t2}else{
        t2 += 0.1;
        }


    ctx3.clearRect(0,0, width, height);
    plotSine3(ctx3, t3);
        if(paused[2]){
        t3}else{
        t3 += 0.1;
        }

    ctx4.clearRect(0,0, width, height);
    plotSine4(ctx4, t4);
        if(paused[3]){
        t4}else{
        t4 += 0.1;
        }

    requestAnimationFrame(draw);
   

}
resizeAll();
draw();
