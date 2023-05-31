import Plants, { PlantFrame } from ".";
import Game from "../Game";
import Projectile from "../Projectiles";

export default class PeaShooter extends Plants {
  public offsetX = 7;
  public offsetY = 2;

  public frameWidth = 185;
  public frameHeight = 157;

  public scale = 2.2;
  public sizeX = this.frameWidth / this.scale;
  public sizeY = this.frameHeight / this.scale;

  public health = 150;

  public static cost = 100;
  public static image = //
    document.getElementById("peaShooter")! as HTMLImageElement;

  public static frame: PlantFrame = {
    sw: 185,
    sh: 157,
    dw: 185 / 2.2,
    dh: 157 / 2.2,
  };

  constructor(public game: Game, public x: number, public y: number) {
    super(game, x, y);
    this.timerInterval = 1000 / this.fps;
  }

  public override update(deltaTime: number) {
    if (this.timer > this.timerInterval) {
      this.timer = 0;
      this.frameX++;

      if (this.frameX >= this.maxFrame) this.frameX = 0;
      if (this.shooting && this.frameX == 30) {
        this.game.audio.peashooterThrow();
        this.game.projectiles.push(
          new Projectile(this.game, this.x + this.width * 0.7, this.y + 15)
        );
      }
    }

    this.timer += deltaTime;
  }

  public override getInstance(): typeof Plants {
    return PeaShooter;
  }

  public override draw(context: CanvasRenderingContext2D) {
    if (this.game.isDebugMode) {
      context.strokeStyle = "black";
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    context.drawImage(
      PeaShooter.image,
      this.frameX * PeaShooter.frame.sw,
      +this.shooting * PeaShooter.frame.sh,
      PeaShooter.frame.sw,
      PeaShooter.frame.sh,
      this.x + this.offsetX,
      this.y + this.offsetY,
      PeaShooter.frame.dw,
      PeaShooter.frame.dh
    );
  }
}
