import Game from "../Game";

export default class Zombies {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public speed: number;
  public movement: any;
  public markedForDeletion = false;
  public image: HTMLImageElement;

  public frameStart = 45;
  public frame = this.frameStart;
  public frameHeight = 125;
  public frameWidth = 185;
  public maxFrame = 135;
  public frameInterval = 2;
  public frameTimer = 0;
  public fps = 30;

  public static walkingFrameStart = 45;
  public static walkingFrameEnd = 135;

  public static eatingFrameStart = 136;
  public static eatingFrameEnd = 175;
  public de = (Zombies.eatingFrameEnd - Zombies.eatingFrameStart) / 3;

  public static dyingFrameStart = [176, 215, 248];
  public static dyingFrameEnd = [214, 247, 377];

  public static dancingFrameStart = 377;
  public static dancingFrameEnd = 427;
  public static maxHealth = 200;

  public isEating = false;
  public isDead = false;
  public health = 190;

  constructor(public game: Game, verticalPosition: number) {
    this.x = this.game.width;
    this.y = verticalPosition;
    this.width = this.game.CELL_WIDTH;
    this.height = this.game.CELL_HEIGHT;
    this.speed = 0.4;
    this.movement = this.speed;
    this.image = document.getElementById("zombie")! as HTMLImageElement;
    this.frameInterval = 1000 / this.fps;
    this.health = Zombies.maxHealth;
    this.game.audio.zombie.groan();
  }

  public update(deltaTime: number) {
    this.x -= this.movement;

    if (this.frameTimer > this.frameInterval) {
      this.frame++;
      if (this.frame >= this.maxFrame) this.frame = this.frameStart;
      this.frameTimer = 0;

      if (this.isEating) {
        const dr = this.frame % Zombies.eatingFrameStart;
        if (dr == this.de || dr == this.de * 2) this.game.audio.zombie.eat();
      }
    }

    this.frameTimer += deltaTime;
  }

  public draw(context: CanvasRenderingContext2D) {
    if (this.game.isDebugMode) {
      context.strokeStyle = "black";
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
      this.image,
      this.frame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
      this.x - 70,
      this.y - 60,
      this.game.CELL_HEIGHT * 2,
      this.game.CELL_WIDTH * 2
    );
  }
}
