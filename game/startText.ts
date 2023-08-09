import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";

export default class StartText extends Behavior {

  text = "By JeCodeLeSoir";
  width = 0;

  OnDestroy(): void {

  }

  constructor() {
    super();
    this.x = Behavior_Instance.SCREEN_WIDTH / 2;
    this.y = Behavior_Instance.SCREEN_HEIGHT / 2;
  }

  Init(ctx: CanvasRenderingContext2D): void {
    this.setIsLoaded(true);
    this.width = ctx.measureText(this.text).width;
  }

  Update(deltaTime: number) {
    this.x -= 60 * deltaTime;
    if (this.x < -300) {
      this.Destroy();
    }
  }


  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.fillStyle = "white";
    ctx.font = "35px Arial";
    ctx.fillText(this.text, this.x, this.y);
  }

}