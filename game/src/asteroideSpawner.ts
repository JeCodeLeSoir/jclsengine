import * as jcls from "jclsengine"

import Asteroide from "./asteroide.js";


export default class AsteroideSpawner extends jcls.Behavior {

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
    this.InitPhysics();
  }

  Update(deltaTime: number) {

    if (this.interval > this.intervalMax) {
      if (this.countAsteroide < this.maxAsteroide) {

        let x = jcls.Behavior_Instance.SCREEN_WIDTH + 100;
        let y = jcls.RandomUtils.Range(0, jcls.Behavior_Instance.SCREEN_HEIGHT);

        let asteroide =
          this.Instantiate(new Asteroide());
        asteroide.position.x = x;
        asteroide.position.y = y;


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

  OnCollisionEnter(other: jcls.Behavior): void {
    console.log("Collision Enter");
  }

  OnCollisionExit(other: jcls.Behavior): void {
    console.log("Collision Exit");
  }
}