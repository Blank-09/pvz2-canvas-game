import Game from "./Game";

export default class Tile {
  public width: number;
  public height: number;

  constructor(public game: Game, public x: number, public y: number) {
    this.width = game.CELL_WIDTH;
    this.height = game.CELL_HEIGHT;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.collision(this, this.game.mouseEvents.mouse)) {
      context.strokeStyle = "black";
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
