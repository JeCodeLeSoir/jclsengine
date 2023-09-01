import * as jcls from "jclsengine";
export default class Score extends jcls.Behavior {
    IsPhysics = false;
    static instance;
    static SetScore(Score) {
    }
    constructor() {
        super();
        this.position.x = 10;
        this.position.y = 10;
    }
    Init(ctx) {
    }
    Load() {
        //this.InitPhysics();
        this.setIsLoaded(true);
    }
    Update(deltaTime) {
    }
    Draw(ctx, deltaTime) {
    }
    OnDestroy() {
    }
}
