import Game from "./Game";
import Plants from "./Plants";
import PeaShooter from "./Plants/PeaShooter";
import Sunflower from "./Plants/Sunflower";
import WallNut from "./Plants/WallNut";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;

// Mouse Events
export default class MouseEvents {
  // FIXME: when the canvas is not at the correct size it causes mouseover to overflow & mouseover problems
  public canvasPosition = canvas.getBoundingClientRect();
  public isMouseDown = false;
  public defender?:
    | typeof Plants
    | typeof PeaShooter
    | typeof WallNut
    | typeof Sunflower;

  public mouse: IMouse = {
    x: 0,
    y: 0,
    width: 0.1,
    height: 0.1,
  };

  constructor(public game: Game) {
    canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x - this.canvasPosition.left;
      this.mouse.y = e.y - this.canvasPosition.top;
    });

    canvas.addEventListener("mouseleave", () => {
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    });

    canvas.addEventListener("mousedown", () => {
      this.isMouseDown = true;
      const x = this.game.width - this.game.shovel.width - 10;
      const y = this.game.height - this.game.shovel.height + 15;

      if (this.game.collision({ x, y, width: 60, height: 60 }, this.mouse)) {
        this.game.shovelActive = true;
        this.game.audio.shovel();
      }
    });

    canvas.addEventListener("mouseup", () => {
      this.isMouseDown = false;

      const Defender = this.defender;
      this.defender = undefined;

      const isSholvesActive = this.game.shovelActive;
      this.game.shovelActive = false;

      if (!this.mouse.x || !this.mouse.y) return;

      const gridPositionX =
        this.mouse.x - (this.mouse.x % this.game.CELL_WIDTH) + 7;
      const gridPositionY =
        this.mouse.y - (this.mouse.y % this.game.CELL_HEIGHT) - 17;

      if (
        gridPositionY < this.game.CELL_WIDTH ||
        gridPositionY > this.game.CELL_HEIGHT * 5 ||
        gridPositionX < this.game.CELL_WIDTH * 3 ||
        gridPositionX > this.game.width - this.game.CELL_WIDTH * 2
      )
        return;

      for (let plant of this.game.plants) {
        if (plant.x === gridPositionX && plant.y == gridPositionY) {
          if (isSholvesActive) {
            this.game.audio.shovel();
            this.game.noOfResource += Math.floor(plant.getInstance().cost / 2);
            plant.markedForDeletion = true;
          }
          return;
        }
      }

      if (Defender && this.game.noOfResource >= Defender.cost) {
        this.game.plants.push(
          // @ts-ignore
          new Defender(this.game, gridPositionX, gridPositionY)
        );
        this.game.noOfResource -= Defender.cost;
      }
    });
  }
}

interface IMouse {
  x?: number;
  y?: number;
  width: number;
  height: number;
}
