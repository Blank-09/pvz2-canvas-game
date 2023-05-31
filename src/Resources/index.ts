export default class Resource {
  public width: number;
  public height: number;
  public amount: number;

  public markedForDeletion = false;
  public y = 0;

  public static image = //
    document.getElementById("sun")! as HTMLImageElement;

  constructor(public x: number, public currPosY: number) {
    this.height = this.width = 70;
    this.y -= this.height;
    this.amount = 25;
  }

  public update() {
    if (this.y <= this.currPosY) this.y += 1;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      Resource.image,
      0,
      0,
      Resource.image.width,
      Resource.image.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
