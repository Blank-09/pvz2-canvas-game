import Game from "../Game";

export default class Background {
  public image: HTMLImageElement;
  public x = 0;

  constructor(public game: Game) {
    this.image = document.getElementById("background1")! as HTMLImageElement;
  }

  public update() {
    if (this.x > -(this.image.width - this.game.width)) this.x -= 1;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, 0);
  }
}
