import Plants, { PlantFrame } from ".";
import Game from "../Game";
import Resource from "../Resources";

export default class Sunflower extends Plants {
  public offsetY = 0;
  public offsetX = 5;
  public scale = 2.5;

  public resourceTimer = 0;
  public resourceInterval = 12000;

  public health = 100;
  public static cost = 50;
  public static image = //
    document.getElementById("sunflower")! as HTMLImageElement;

  public static frame: PlantFrame = {
    sw: 203,
    sh: 219,
    dw: 203 / 2.6,
    dh: 219 / 2.6,
  };

  constructor(public game: Game, public x: number, public y: number) {
    super(game, x, y);
  }

  public override update(deltaTime: number): void {
    super.update(deltaTime);
    this.resourceTimer += deltaTime;
    if (this.resourceTimer > this.resourceInterval) {
      this.resourceTimer = 0;
      const sun = new Resource(this.x - 10, this.y);
      sun.y = this.y - 25;
      this.game.resources.push(sun);
    }
  }

  public getInstance(): typeof Plants {
    return Sunflower;
  }
}
