import Game from "./Game";

export default class Projectile {
  public width = 10;
  public height = 10;
  public power = 20;
  public speed = 5;
  public markedForDeletion = false;
  public image: HTMLImageElement;

  constructor(public game: Game, public x: number, public y: number) {
    this.image = document.getElementById("pea")! as HTMLImageElement;
  }

  public update() {
    this.x += this.speed;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, 0, 0, 60, 64, this.x, this.y, 20, 22);
  }
}
