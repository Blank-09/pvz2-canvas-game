import Background from "./Background";
import "./css/style.css";
import Game from "./Game";

export const font = "fbUsv8C5eI";

export const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

const bgCanvas = document.getElementById(
  "background-canvas"
)! as HTMLCanvasElement;
const bgContext = bgCanvas.getContext("2d")!;

bgCanvas.height = canvas.height = 600;
bgCanvas.width = canvas.width = (canvas.height * 16) / 9;

const game = new Game(canvas.width, canvas.height);

// Animation
let lastTime = 0;

function animate(timeStamp: number) {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;

  context.clearRect(0, 0, canvas.width, canvas.height);

  game.update(deltaTime);
  game.draw(context);

  if (!game.gameOver) requestAnimationFrame(animate);
  else {
    game.audio.defeat();
    context.strokeStyle = "white";
    context.font = "120px " + font;
    context.fillText("GAME OVER", canvas.width * 0.3, canvas.height * 0.55);
    context.fillStyle = "black";
    context.strokeText("GAME OVER", canvas.width * 0.3, canvas.height * 0.55);
  }
}

animate(0);

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
}

const background = new Background(game);
background.draw(bgContext);

bgContext.globalAlpha = 0.5;
roundRect(bgContext, 35, 20, 95, 30, 5).fill();
bgContext.globalAlpha = 1.0;

const sun = document.getElementById("sun")! as HTMLImageElement;
bgContext.drawImage(sun, 0, 0, sun.width, sun.height, 0, 0, 70, 70);
