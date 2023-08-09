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

  cooldown: number = 1;
  cooldownMax: number = 1.5;


  constructor() {
    super();
    this.x = Behavior_Instance.SCREEN_WIDTH + 10;
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

  zigzag: boolean = false;

  Update(deltaTime: number) {

    /* Is Enemy */

    if (this.x > Behavior_Instance.SCREEN_WIDTH - 150) {
      this.x -= 60 * deltaTime;
    }

    /* zigzag en y */

    if (this.y > Behavior_Instance.SCREEN_HEIGHT) {
      this.zigzag = false;
    }

    if (this.y < 0) {
      this.zigzag = true;
    }

    this.y = this.zigzag ? this.y + 60 * deltaTime
      : this.y - 60 * deltaTime;


    if (this.cooldown <= 0) {
      this.cooldown = this.cooldownMax;
      let obj = this.Instantiate(new Missile());
      obj.SetPosition(this.x + this.width / 2, this.y);
      obj.SetTag("Missile-Enemy");
      obj.setInverted(true);
    }

    this.cooldown -= deltaTime;
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {

    /* inverse image */

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(this.image,
      Math.round(-this.x - this.width / 2),
      Math.round(this.y - this.height / 2)
    );
    ctx.restore();
  }

  OnDestroy(): void {

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