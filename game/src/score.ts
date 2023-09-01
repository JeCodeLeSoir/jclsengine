import * as jcls from "jclsengine"
export default class Score extends jcls.Behavior {

  protected IsPhysics: boolean = false;
  static instance: Score;
  static SetScore(Score: number) {

  }

  constructor() {
    super();
    this.position.x = 10;
    this.position.y = 10;
  }

  Init(ctx: CanvasRenderingContext2D): void {

  }

  Load(): void {
    //this.InitPhysics();
    this.setIsLoaded(true);
  }

  Update(deltaTime: number) {

  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {

  }


  OnDestroy(): void {

  }
}