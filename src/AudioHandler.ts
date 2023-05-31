export default class AudioHandler {
  public audio = {
    points: "/src/assets/Audio/Points.ogg",
    shovel: "/src/assets/Audio/Shovel.ogg",
    reward: "/src/assets/Audio/RewardFrontLawn.ogg",
    defeat: "/src/assets/Audio/DefeatFrontLawn.ogg",
    zombieEating: "/src/assets/Audio/zombie_eating.mp3",

    zombie: (i: number) => `/src/assets/Audio/Zombies/FutureGroan${i + 1}.ogg`,

    bgms: [
      "/src/assets/Audio/Bgm/133. Modern Day (First Wave).mp3",
      "/src/assets/Audio/Bgm/134. Modern Day (Midwave A).mp3",
    ],

    peashooter: {
      throw: (i: number) => `/src/assets/Audio/PeaShooter/Throw${i + 1}.ogg`,
      splat: (i: number) => `/src/assets/Audio/PeaShooter/Splat${i + 1}.ogg`,
    },
  };

  public bgm: HTMLAudioElement;
  private index: number = 0;

  constructor() {
    this.bgm = this.play(this.audio.bgms[this.index]);
    this.bgm.onended = () => {
      this.index++;
      this.bgm.src = this.audio.bgms[this.index % 2];
      this.bgm.load();
      this.bgm.currentTime = 0;
      this.bgm.play();
    };
  }

  public defeat() {
    this.bgm.pause();
    this.play(this.audio.defeat);
  }

  private play(src: string, volume?: number) {
    const audio = new Audio(src);
    audio.load();
    audio.onloadstart = () => audio.play();
    if (volume) audio.volume = volume;
    return audio;
  }

  public sunCollected() {
    return this.play(this.audio.points);
  }

  public shovel() {
    return this.play(this.audio.shovel);
  }

  public peashooterThrow() {
    return this.play(
      this.audio.peashooter.throw(Math.floor(Math.random() * 2))
    );
  }

  public peaSplat() {
    return this.play(
      this.audio.peashooter.splat(Math.floor(Math.random() * 3))
    );
  }

  public zombie = {
    groan: () =>
      this.play(this.audio.zombie(Math.floor(Math.random() * 11)), 0.7),
    eat: () => this.play(this.audio.zombieEating, 0.7),
  };
}
