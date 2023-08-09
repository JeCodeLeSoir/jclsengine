import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";

export class AsteroideSpawner extends Behavior {

  static instance: AsteroideSpawner

  intervalMax: number = 0.42;
  interval: number = 0;

  maxAsteroide: number = 80;
  countAsteroide: number = 0;

  constructor() {
    super();
    AsteroideSpawner.instance = this;
  }

  Load() {
    this.setIsLoaded(true);
  }

  Update(deltaTime: number) {

    if (this.interval > this.intervalMax) {
      if (this.countAsteroide < this.maxAsteroide) {

        let x = Behavior_Instance.SCREEN_WIDTH + 100;
        let y = this.RandomRand(0, Behavior_Instance.SCREEN_HEIGHT);

        this.Instantiate(new Asteroide(x, y));

        this.countAsteroide++;
      }
      this.interval = 0;
    }

    this.interval += 0.5 * deltaTime;
  }

  RandomRand(min, max) {
    return Math.random() * (max - min) + min;
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {

  }

  AsteroideOnDestroy(asteroide: Asteroide) {
    this.countAsteroide--;
  }

  OnDestroy(): void {

  }

  OnCollisionEnter(other: Behavior): void {
    console.log("Collision Enter");
  }

  OnCollisionExit(other: Behavior): void {
    console.log("Collision Exit");
  }
}

export class Asteroide extends Behavior {
  protected Tag: string = "Asteroide";
  protected DisplayOrder: number = -1;
  protected IsPhysics: boolean = true;

  image: HTMLImageElement;
  height: number = 0;
  width: number = 0;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.image = new Image();
  }

  Load() {
    this.image.src = './asteroide.png';
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
    this.x -= 60 * deltaTime;
    if (this.x < - (this.width / 2)) {
      this.Destroy();
    }
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.drawImage(this.image,
      Math.round(this.x - this.width / 2),
      Math.round(this.y - this.height / 2)
    );
  }

  OnDestroy(): void {
    AsteroideSpawner.instance.AsteroideOnDestroy(this);
  }

  OnCollisionEnter(other: Behavior): void {
    if (other.GetTag() === "Missile") {
      this.Destroy();
    }
  }

  OnCollisionExit(other: Behavior): void {

  }
}