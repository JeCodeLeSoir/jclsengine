import * as jcls from "jclsengine"
import Missile from "./missile.js";

export default class Enemy extends jcls.Behavior {

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
    this.position.x = jcls.Behavior_Instance.SCREEN_WIDTH + 10;
    this.position.y = jcls.Behavior_Instance.SCREEN_HEIGHT / 2;
    this.speed = 150;
    this.rotation = 0;
    this.image = new Image();

    Enemy.instance = this;
  }

  Load() {
    this.image.src = './assets/player.png';

    this.image.addEventListener('load', () => {
      this.height = this.image.height;
      this.width = this.image.width;

      this.boundingBox = new jcls.Bounds(new
        jcls.Vector2(this.position.x, this.position.y), new
        jcls.Vector2(this.width, this.height));

      this.setIsLoaded(true);
    })

  }

  zigzag: boolean = false;

  Update(deltaTime: number) {

    /* Is Enemy */

    if (this.position.x > jcls.Behavior_Instance.SCREEN_WIDTH - 150) {
      this.position.x -= 60 * deltaTime;
    }

    /* zigzag en y */

    if (this.position.y > jcls.Behavior_Instance.SCREEN_HEIGHT) {
      this.zigzag = false;
    }

    if (this.position.y < 0) {
      this.zigzag = true;
    }

    this.position.y = this.zigzag ? this.position.y + 60 * deltaTime
      : this.position.y - 60 * deltaTime;


    if (this.cooldown <= 0) {
      this.cooldown = this.cooldownMax;
      let obj = this.Instantiate(new Missile());
      obj.SetPosition(new jcls.Vector2(this.position.x + this.width / 2, this.position.y));
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
      Math.round(-this.position.x - this.width / 2),
      Math.round(this.position.y - this.height / 2)
    );
    ctx.restore();
  }

  OnDestroy(): void {

  }

  OnCollisionEnter(other: jcls.Behavior): void {

    if (other.GetTag() === "player") {
      this.Destroy();
    }

    if (other.GetTag() === "Missile") {
      this.Destroy();
    }
  }
}