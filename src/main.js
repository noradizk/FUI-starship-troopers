import { initGridFx } from "./gridFx.js";

// code pour le popup
let selected = document.querySelector("#load-image");
let popup    = document.querySelector(".popup");
let imageBtns = document.querySelectorAll(".selection");// plusieurs éléments
//id image pour l'afficher ?? ou ptre utiliser un JSON 
let tattooImg = document.querySelector(".image-tattoo");
let ImgSelect = document.querySelectorAll(".selection-img")

initGridFx();


// DATA des tattoos
const tattoos = {
  death: {
    main: "/images/death.jpg",
    overlay: "/images/death-red.jpg"
  },

  infantry: {
    main: "/images/infantry-selection.jpg",
    overlay: "/images/infantry.jpg"
  }
}

let currentTattooId = null

// ouvrir/fermer le popup
function pagePOP() {
  //popup
  if (popup.style.display === "none" || popup.style.display === "") {
    popup.style.display = "flex";
  } else {
    popup.style.display = "none";
  }
}

selected.addEventListener("click", pagePOP);

function applyTattoo(id){
  currentTattooId = id;
  const data = tattoos[id];

  //1) merttre l'image dans.image-tattoo
  tattooImg.src = data.main;

  //2) demander au canvas de grille de dessiner la version overlay
  //window. permet d'avoir accès entre les function de chaque fichier psk ils sont en mode module
  window.drawTattooOnGrid(data.overlay);

}

imageBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    pagePOP(); // fermer popup

    const id = btn.dataset.tattoo; // récupère "death", "skull", etc.
    applyTattoo(id);
  });
});



/*
A FAIRE 


- FINALISER LA MISE EN PAGE
  TAILLE DES IMAGES 
  BLUR SUR SUR LES ELEMENTS DU FUI 
  SUPPRIMER LA SOURIS 

- ANIMATION 
  ANIMATION TEXTE (REGARDER LE FILM)
  ANIMATION EN BAS D'ECRAN. ANIMATION ARRIERE PLAN (PTRE VIDEO)

- ORGANISATION 
  FAIRE UN JSON
*/





