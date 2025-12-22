// text violet 
const zone = document.getElementById('text-purple');
const canvas = document.getElementById("purple-rain");
const ctx = canvas.getContext("2d");



function resize() {
    const rect = zone.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;    
    width = canvas.width;
    height = canvas.height; 
}


const digitsContainer = document.getElementById("digits");

const digits = [0,1,2,3,4,5,6,7,8,9];

const blockRows = 4;
const blockCols = 4;

const blocksCount = 4; // 4 blocs (2x2 avec le CSS au-dessus)

digitsContainer.innerHTML = ""; // reset

for (let b = 0; b < blocksCount; b++) {
  const block = document.createElement("div");
  block.classList.add("block");

  for (let i = 0; i < blockRows; i++) {
    for (let j = 0; j < blockCols; j++) {
      const cell = document.createElement("div");

      cell.classList.add("digit");

      const r = digits[Math.floor(Math.random() * digits.length)];
      cell.textContent = r;

      block.appendChild(cell);
    }
  }

  digitsContainer.appendChild(block);
}

const FADE = 300;      // doit matcher transition CSS (ms)
const STAGGER = 120;   // décalage entre chaque block (ms)
const PAUSE = 400;
const CYCLE = (blocksCount-1) * STAGGER + FADE + FADE + PAUSE;
setInterval(updateDigits, CYCLE);
let isAnimating = false;

function updateDigits() {
  if (isAnimating) return;
  isAnimating = true;

  const blocks = Array.from(digitsContainer.getElementsByClassName("block"));

  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    const delay = b * STAGGER;

    setTimeout(() => {
      // 1) fade out
      block.classList.add("is-hidden");

      // 2) quand le fade out est fini -> update chiffres + fade in
      setTimeout(() => {
        const cells = block.getElementsByClassName("digit");

        for (let c = 0; c < cells.length; c++) {
          const r = digits[Math.floor(Math.random() * digits.length)];
          cells[c].textContent = r;
        }

        // fade in
        block.classList.remove("is-hidden");

        // déverrouille à la fin du dernier block
        if (b === blocks.length - 1) {
          setTimeout(() => { isAnimating = false; }, FADE);
        }
      }, FADE);

    }, delay);
  }
}

