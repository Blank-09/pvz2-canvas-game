import Game from "../Game";
import Plants from "../Plants";

export default abstract class SeedPack {
  abstract refreshInterval: number;
  abstract height: number;
  abstract width: number;
  abstract image: HTMLImageElement;
  abstract plant: typeof Plants;

  constructor(public game: Game, public x: number, public y: number) {}

  public update(deltaTime: number) {}

  public draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    if (
      this.game.mouseEvents.isMouseDown &&
      this.game.collision(this, this.game.mouseEvents.mouse) &&
      !this.game.mouseEvents.defender
    )
      this.game.mouseEvents.defender = this.plant;
  }
}
