import * as jcls from "jclsengine"
class Particul {

  x: number;
  y: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.color = "white";
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, 1, 1);
  }
}

export default class StarBackground extends jcls.Behavior {

  protected DisplayOrder: number = -2;

  Particul = new Array<Particul>();

  particulMax = 10000;
  countParticul = 0;

  generateInterval = 1000;
  lastGeneratedTime = 0;

  OnDestroy(): void {

  }

  constructor() {
    super();
    console.log("StarBackground created");
  }

  Load() {

    /*for (let i = 0; i < this.particulMax / 100; i++) {
      let x = jcls.RandomUtils.Range(0, jcls.Behavior_Instance.SCREEN_WIDTH);
      let y = jcls.RandomUtils.Range(0, jcls.Behavior_Instance.SCREEN_HEIGHT);
      this.Particul.push(new Particul(x, y));
      this.countParticul++;
    }*/

    this.setIsLoaded(true);
    this.InitPhysics();
  }

  Update(deltaTime: number) {
    /* Generate new stars */

    const currentTime = Date.now();
    if (currentTime - this.lastGeneratedTime > this.generateInterval) {
      if (this.countParticul < this.particulMax) {
        let x = jcls.Behavior_Instance.SCREEN_WIDTH;
        let y = jcls.RandomUtils.Range(0, jcls.Behavior_Instance.SCREEN_HEIGHT);
        this.Particul.push(new Particul(x, y));
        this.countParticul++;
      }
      this.lastGeneratedTime = currentTime;
    }


    /* Update stars */
    for (let i = 0; i < this.Particul.length; i++) {
      this.Particul[i].x -= 42 * deltaTime;
      if (this.Particul[i].x < 0) {
        this.Particul.splice(i, 1);
        this.countParticul--;
      }
    }
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    for (let i = 0; i < this.Particul.length; i++) {
      this.Particul[i].Draw(ctx, deltaTime);
    }
  }
}