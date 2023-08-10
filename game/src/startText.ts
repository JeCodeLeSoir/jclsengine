import * as jcls from "jclsengine"
export default class StartText extends jcls.Behavior {

  text = "By JeCodeLeSoir";
  width = 0;

  OnDestroy(): void {

  }

  constructor() {
    super();
    this.position.x = jcls.Behavior_Instance.SCREEN_WIDTH / 2;
    this.position.y = jcls.Behavior_Instance.SCREEN_HEIGHT / 2;
  }

  Init(ctx: CanvasRenderingContext2D): void {
    this.setIsLoaded(true);
    this.width = ctx.measureText(this.text).width;
  }

  Update(deltaTime: number) {
    this.position.x -= 60 * deltaTime;
    if (this.position.x < -300) {
      this.Destroy();
    }
  }


  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.fillStyle = "white";
    ctx.font = "35px Arial";
    ctx.fillText(this.text, this.position.x, this.position.y);
  }

}