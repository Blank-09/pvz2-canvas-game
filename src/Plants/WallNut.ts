import Plants, { PlantFrame } from ".";
import Game from "../Game";

export default class WallNut extends Plants {
  public frameWidth = 64;
  public frameHeight = 72;

  public fps = 20;
  public maxFrame = 44;
  public offsetY = 10;
  public offsetX = 10;

  public sizeX = this.frameWidth / this.scale;
  public sizeY = this.frameHeight / this.scale;

  public health = 2000;
  public static cost = 50;
  public static image = //
    document.getElementById("wallnut")! as HTMLImageElement;

  public static frame: PlantFrame = //
    { sw: 64, sh: 72, dw: 64, dh: 72 };

  constructor(public game: Game, public x: number, public y: number) {
    super(game, x, y);
    this.timerInterval = 1000 / this.fps;
  }

  public getInstance(): typeof Plants {
    return WallNut;
  }
}
