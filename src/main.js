import { initGridFx } from "./gridFx.js";
import "./scale.js";

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
  death_above: {
    main: "/images/death-above.png",
    overlay: "/images/death-grid.png"
  },

  infantry: {
    main: "/images/infantry.png",
    overlay: "/images/infantry-grid.png"
  },

    UCF: {
    main: "/images/UCF.png",
    overlay: "/images/UCF-grid.png"
  },
    arachnids: {
    main: "/images/arachnids.png",
    overlay: "/images/arachnids-grid.png"
  },
    FedNet: {
    main: "/images/FedNet.png",
    overlay: "/images/FedNet-grid.png"
  },

    NoBugs: {
    main: "/images/NoBugs.png",
    overlay: "/images/NoBugs-grid.png"
  },

    Fleet: {
    main: "/images/fleet.png",
    overlay: "/images/fleet-grid.png"
  },
    rough: {
    main: "/images/rough.png",
    overlay: "/images/rough-grid.png"
  },
    more: {
    main: "/images/more.png",
    overlay: "/images/more-grid.png"
  },
    sword: {
    main: "/images/sword.png",
    overlay: "/images/sword-grid.png"
  },
    movie_logo: {
    main: "/images/movie-logo.png",
    overlay: "/images/movie-logo-grid.png"
  },
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





