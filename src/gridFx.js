export function initGridFx() {
  const host = document.querySelector(".fx-host");
  const canvas = document.getElementById("grid-fx");
  if (!host || !canvas) return;

  const ctx = canvas.getContext("2d");
  let dpr = window.devicePixelRatio || 1;
  let cssW = 0;
  let cssH = 0;
  // const DEBUG = true; // enable to visualize bounds

  function resize() {
    const hostBounds = host.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    cssW = Math.floor(hostBounds.width);
    cssH = Math.floor(hostBounds.height);

    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // simple blue fill (no animation)
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "rgb(20, 80, 200)";
    ctx.fillRect(0, 0, cssW, cssH);
  }

  let resizeId = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(resize, 80);
  });

  resize();
}
