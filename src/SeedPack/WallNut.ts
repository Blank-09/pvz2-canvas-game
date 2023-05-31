import SeedPack from ".";
import Game from "../Game";
import WallNut from "../Plants/WallNut";

export default class WallNutSeedPack extends SeedPack {
  public refreshInterval = 5000;
  public refreshTimer = 0;

  public plant = WallNut;

  public height: number;
  public width: number;
  public image: HTMLImageElement;

  constructor(public game: Game, public x: number, public y: number) {
    super(game, x, y);
    this.image = //
      document.getElementById("wallnutSeedPack")! as HTMLImageElement;

    this.height = this.image.height * 0.43;
    this.width = this.image.width * 0.43;
  }
}
