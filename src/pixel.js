export default class Pixel {
  constructor(x, y, size, id = 0) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.id = id;
    this.color = [0, 0, 0, 0]; // transparent par défaut
  }

  setColor(rgba) {
    this.color = rgba; // ex: [r,g,b,a]
  }

  draw(ctx) {
    const [r, g, b, a] = this.color;
    if (a === 0) return; // rien à afficher

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}