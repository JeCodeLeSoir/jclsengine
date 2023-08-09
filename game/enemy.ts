import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";
import Missile from "./missile.js";

export default class Enemy extends Behavior {

  static instance: Enemy;

  protected Tag: string = "player";
  protected IsPhysics: boolean = true;
  protected DisplayOrder: number = 2;

  image: HTMLImageElement;
  height: number = 0;
  width: number = 0;

  speed: number;
  rotation: number;

  cooldown: number = 0;
  cooldownMax: number = 0.5;

  score: number = 0;

  constructor() {
    super();
    this.x = 25;
    this.y = Behavior_Instance.SCREEN_HEIGHT / 2;
    this.speed = 150;
    this.rotation = 0;
    this.image = new Image();

    Enemy.instance = this;
  }

  Load() {
    this.image.src = './player.png';

    this.image.addEventListener('load', () => {
      this.height = this.image.height;
      this.width = this.image.width;

      this.boundingBox = new Bounds(new
        Vector2(this.x, this.y), new
        Vector2(this.width, this.height));

      this.setIsLoaded(true);
    })

  }

  Update(deltaTime: number) {



    this.cooldown -= deltaTime;
    this.score += 0.025 * deltaTime;
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.drawImage(this.image,
      Math.round(this.x - this.width / 2),
      Math.round(this.y - this.height / 2)
    );
  }

  OnDestroy(): void {
    window.location.reload();
  }

  OnCollisionEnter(other: Behavior): void {

    if (other.GetTag() === "player") {
      this.Destroy();
    }

    if (other.GetTag() === "Missile") {
      this.Destroy();
    }
  }
}