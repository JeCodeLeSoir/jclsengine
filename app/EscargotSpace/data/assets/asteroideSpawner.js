import { Behavior_Instance } from "./app.js";
import Asteroide from "./asteroide.js";
import Behavior from "./core/behavior.js";
import RandomUtils from "./utils/randomUtils.js";
export default class AsteroideSpawner extends Behavior {
    static instance;
    intervalMax = 0.42;
    interval = 0;
    maxAsteroide = 80;
    countAsteroide = 0;
    constructor() {
        super();
        AsteroideSpawner.instance = this;
    }
    Load() {
        this.setIsLoaded(true);
    }
    Update(deltaTime) {
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
    Draw(ctx, deltaTime) {
    }
    AsteroideOnDestroy(asteroide) {
        this.countAsteroide--;
    }
    OnDestroy() {
    }
    OnCollisionEnter(other) {
        console.log("Collision Enter");
    }
    OnCollisionExit(other) {
        console.log("Collision Exit");
    }
}
