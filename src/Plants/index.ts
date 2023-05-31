import Game from "../Game";

export interface PlantFrame {
  sw: number;
  sh: number;
  dw: number;
  dh: number;
}

export default abstract class Plants {
  public width: number;
  public height: number;

  public shooting = false;
  public markedForDeletion = false;

  public fps = 60;
  public scale = 1;
  public frameX = 0;
  public frameY = 0;
  public maxFrame = 60;

  public timer = 0;
  public timerInterval = 1000 / this.fps;

  public abstract health: number;

  public abstract offsetY: number;
  public abstract offsetX: number;

  public static cost = 100;
  public static image: HTMLImageElement;
  public static frame: PlantFrame;

  constructor(public game: Game, public x: number, public y: number) {
    this.width = game.CELL_WIDTH;
    this.height = game.CELL_HEIGHT;
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (this.game.isDebugMode) {
      context.strokeStyle = "black";
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    const Plant = this.getInstance();

    context.drawImage(
      Plant.image,
      this.frameX * Plant.frame.sw,
      this.frameY * Plant.frame.sh,
      Plant.frame.sw,
      Plant.frame.sh,
      this.x + this.offsetX,
      this.y + this.offsetY,
      Plant.frame.dw,
      Plant.frame.dh
    );
  }

  public abstract getInstance(): typeof Plants;

  public update(deltaTime: number): void {
    if (this.timer > this.timerInterval) {
      this.timer = 0;
      this.frameX++;
      if (this.frameX >= this.maxFrame) this.frameX = 0;
    }

    this.timer += deltaTime;
  }
}
