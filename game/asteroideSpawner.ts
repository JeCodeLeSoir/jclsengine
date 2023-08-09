import { Behavior_Instance } from "./app.js";
import Asteroide from "./asteroide.js";
import Behavior from "./core/behavior.js";
import RandomUtils from "./utils/randomUtils.js";

export default class AsteroideSpawner extends Behavior {

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
        let y = RandomUtils.Range(0, Behavior_Instance.SCREEN_HEIGHT);

        this.Instantiate(new Asteroide(x, y));

        this.countAsteroide++;
      }
      this.interval = 0;
    }

    this.interval += 0.5 * deltaTime;
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