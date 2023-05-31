import Tile from "./Tile";
import MouseEvents from "./MouseEvents";
import Plants from "./Plants";
import Zombies from "./Zombies";
import Projectile from "./Projectiles";
import Resource from "./Resources";
import SeedPack from "./SeedPack";

// Seed Pack
import PeaShooterSeedPack from "./SeedPack/PeaShooter";
import SunFlowerSeedPack from "./SeedPack/SunFlowerSeedPack";
import WallNutSeedPack from "./SeedPack/WallNut";
import { font } from "./main";
import AudioHandler from "./AudioHandler";

export default class Game {
  public CELL_HEIGHT = 98;
  public CELL_WIDTH = 81;
  public CELL_GAP = 3;

  public resourceTimer = 0;
  public resourceInterval = 500;

  public zombiesInterval = 700;
  public noOfResource = 300;
  public frame = 0;

  public mouseEvents: MouseEvents;
  public gameOver = false;
  public isDebugMode = false;

  public audio: AudioHandler;

  // Arrays
  public gameGrid: Tile[] = [];
  public plants: Plants[] = [];
  public zombies: Zombies[] = [];
  public projectiles: Projectile[] = [];
  public resources: Resource[] = [];
  public seedPacks: SeedPack[] = [];

  public score = 0;
  public winningScore = 100;
  public deltaTime = 0;

  constructor(public width: number, public height: number) {
    this.mouseEvents = new MouseEvents(this);
    this.audio = new AudioHandler();
    this.createGrid();
    this.seedPacks.push(
      new SunFlowerSeedPack(this, 0, 90),
      new PeaShooterSeedPack(this, 0, 160),
      new WallNutSeedPack(this, 0, 230)
    );
  }

  public collision(rect1: any, rect2: any) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }

  public handlePlants(context: CanvasRenderingContext2D) {
    for (let plant of this.plants) {
      plant.draw(context);
      plant.update(this.deltaTime);

      plant.shooting = this.zombies.reduce(
        (a, b) => a || (plant.y == b.y && !b.isDead),
        false
      );

      for (let zombie of this.zombies) {
        if (!zombie.isDead && this.collision(plant, zombie)) {
          zombie.movement = 0;
          plant.health -= 0.2;
          if (!zombie.isEating) {
            zombie.frame = Zombies.eatingFrameStart;
            zombie.isEating = true;
          }
          zombie.frameStart = Zombies.eatingFrameStart;
          zombie.maxFrame = Zombies.eatingFrameEnd;
        }
        if (plant.health <= 0) {
          plant.markedForDeletion = true;
          zombie.movement = zombie.speed;
          zombie.isEating = false;
          zombie.frame = Zombies.walkingFrameStart;
          zombie.frameStart = Zombies.walkingFrameStart;
          zombie.maxFrame = Zombies.walkingFrameEnd;
        }
      }
    }
  }

  public handleZombies(context: CanvasRenderingContext2D) {
    for (let zombie of this.zombies) {
      zombie.update(this.deltaTime);
      zombie.draw(context);

      if (zombie.x < this.CELL_WIDTH) this.gameOver = true;
      if (zombie.health <= 0 && !zombie.isDead) {
        zombie.isDead = true;
        zombie.movement = 0;
        const randomDeath = Math.random();
        let index = 2;

        if (randomDeath < 0.5) index = 0;
        else if (randomDeath < 0.8) index = 1;

        zombie.frame = Zombies.dyingFrameStart[index];
        zombie.frameStart = Zombies.dyingFrameStart[index];
        zombie.maxFrame = Zombies.dyingFrameEnd[index];
      }
      if (Zombies.dyingFrameEnd.includes(zombie.frame + 1)) {
        zombie.markedForDeletion = true;
      }
    }

    if (this.frame > this.zombiesInterval) {
      this.zombies.push(
        new Zombies(
          this,
          (Math.floor(Math.random() * 5) + 1) * this.CELL_HEIGHT - 17
        )
      );

      if (this.zombiesInterval > 120) {
        this.zombiesInterval -= 60;
        Zombies.maxHealth += 2;
      }

      this.frame = 0;
    }
  }

  public handleProjectiles(context: CanvasRenderingContext2D) {
    for (let projectile of this.projectiles) {
      projectile.update();
      projectile.draw(context);

      for (let zombie of this.zombies) {
        if (!zombie.isDead && this.collision(projectile, zombie)) {
          zombie.health -= projectile.power;
          projectile.markedForDeletion = true;
          this.audio.peaSplat();
        }
      }

      if (projectile.x > this.width - this.CELL_WIDTH) {
        projectile.markedForDeletion = true;
      }
    }
  }

  public handleResources(context: CanvasRenderingContext2D) {
    this.resourceTimer += 1;

    // NOTE: the resouces will keep building even after game over
    if (this.resourceTimer > this.resourceInterval) {
      this.resources.push(
        new Resource(
          Math.random() * (this.width - this.CELL_WIDTH * 2) + this.CELL_WIDTH,
          Math.floor(Math.random() * 5 + 1) * this.CELL_HEIGHT
        )
      );
      this.resourceTimer = 0;
    }

    for (let resource of this.resources) {
      resource.draw(context);
      resource.update();

      if (
        this.mouseEvents.mouse.x &&
        this.mouseEvents.mouse.y &&
        this.collision(resource, this.mouseEvents.mouse)
      ) {
        this.noOfResource += resource.amount;
        resource.markedForDeletion = true;
        this.audio.sunCollected();
      }
    }
  }

  public handleGameStatus(context: CanvasRenderingContext2D) {
    context.save();

    context.fillStyle = "white";
    context.font = "25px " + font;
    context.shadowColor = "black";
    context.shadowOffsetY = 3;
    context.shadowOffsetX = 3;

    const resources = this.noOfResource.toString();
    let width = 94;

    context.fillText(resources, width - 5 * resources.length, 43);
    context.restore();
  }

  public handleSeedPack(context: CanvasRenderingContext2D) {
    for (let seedPack of this.seedPacks) {
      seedPack.update(this.deltaTime);
      seedPack.draw(context);
    }
  }

  public update(deltaTime: number) {
    this.frame++;
    this.deltaTime = deltaTime;
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );
    this.zombies = this.zombies.filter((zombie) => !zombie.markedForDeletion);
    this.plants = this.plants.filter((plant) => !plant.markedForDeletion);
    this.resources = this.resources.filter(
      (resource) => !resource.markedForDeletion
    );
  }

  public pauseBtn = document.getElementById("pauseBtn")! as HTMLImageElement;

  public draw(context: CanvasRenderingContext2D) {
    this.handleGameGrid(context);
    this.handlePlants(context);
    this.handleProjectiles(context);
    this.handleZombies(context);
    this.handleResources(context);
    this.handleSeedPack(context);
    this.handleGameStatus(context);
    this.handleDrag(context);
    this.handleShovel(context);
    context.drawImage(
      this.pauseBtn,
      0,
      0,
      this.pauseBtn.width,
      this.pauseBtn.height,
      this.width - 60,
      10,
      50,
      50
    );
  }

  public shovel = document.getElementById("shovel")! as HTMLImageElement;
  public shovel2 = document.getElementById("shovel2")! as HTMLImageElement;
  public shovelActive = false;

  public handleShovel(context: CanvasRenderingContext2D) {
    context //
      .drawImage(
        this.shovel,
        0,
        0,
        this.shovel.width,
        this.shovel.height,
        this.width - this.shovel.width - 10,
        this.height - this.shovel.height + 15,
        60,
        60
      );

    if (
      this.mouseEvents.mouse.x &&
      this.mouseEvents.mouse.y &&
      this.mouseEvents.isMouseDown &&
      this.shovelActive
    ) {
      context //
        .drawImage(
          this.shovel2,
          0,
          0,
          this.shovel2.width,
          this.shovel2.height,
          this.mouseEvents.mouse.x - 30,
          this.mouseEvents.mouse.y - 30,
          60,
          60
        );
    }
  }

  public handleDrag(context: CanvasRenderingContext2D) {
    if (
      this.mouseEvents.mouse.x &&
      this.mouseEvents.mouse.y &&
      this.mouseEvents.defender &&
      this.mouseEvents.isMouseDown
    ) {
      const defender = this.mouseEvents.defender;
      context.drawImage(
        defender.image,
        0,
        0,
        defender.frame.sw,
        defender.frame.sh,
        this.mouseEvents.mouse.x - this.CELL_WIDTH * 0.5,
        this.mouseEvents.mouse.y - this.CELL_HEIGHT * 0.5,
        defender.frame.dw,
        defender.frame.dh
      );
    }
  }

  public handleGameGrid(context: CanvasRenderingContext2D) {
    for (let grid of this.gameGrid) grid.draw(context);
  }

  private createGrid() {
    const col = this.height - this.CELL_HEIGHT;
    const row = this.width - this.CELL_WIDTH - 20;

    for (let y = this.CELL_WIDTH; y < col; y += this.CELL_HEIGHT) {
      for (let x = 250; x < row; x += this.CELL_WIDTH) {
        this.gameGrid.push(new Tile(this, x, y));
      }
    }
  }
}
