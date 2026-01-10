const stage = document.getElementById("stage");
function resize(){
    const scale = Math.min(window.innerWidth/800, window.innerHeight/600)
        stage.style.transform = `scale(${scale})`;
}

window.addEventListener("resize",resize);
resize();