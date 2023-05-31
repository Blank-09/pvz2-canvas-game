import SeedPack from ".";
import Game from "../Game";
import { font } from "../main";
import PeaShooter from "../Plants/PeaShooter";

export default class PeaShooterSeedPack extends SeedPack {
  public refreshInterval = 5000;
  public refreshTimer = 0;
  public offsetX = 0;
  public offsetY = 0;

  public plant = PeaShooter;

  public height: number;
  public width: number;
  public image: HTMLImageElement;

  constructor(public game: Game, public x: number, public y: number) {
    super(game, x, y);
    this.image = //
      document.getElementById("peashooterSeedPack")! as HTMLImageElement;

    this.height = this.image.height * 0.55;
    this.width = this.image.width * 0.55;
    this.offsetX = this.width - 40;
    this.offsetY = this.height - 2;
  }

  public override draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    context.save();
    context.fillStyle = "white";
    context.font = "30px " + font;
    context.shadowColor = "black";
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.fillText("100", this.x + this.offsetX, this.y + this.offsetY);
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.strokeText("100", this.x + this.offsetX, this.y + this.offsetY);
    context.restore();
  }
}
