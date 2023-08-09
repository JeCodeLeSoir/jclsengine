import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";
export class AsteroideSpawner extends Behavior {
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
export class Asteroide extends Behavior {
    Tag = "Asteroide";
    DisplayOrder = -1;
    IsPhysics = true;
    image;
    height = 0;
    width = 0;
    constructor(x, y) {
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
            this.boundingBox = new Bounds(new Vector2(this.x, this.y), new Vector2(this.width, this.height));
            this.setIsLoaded(true);
        });
    }
    Update(deltaTime) {
        this.x -= 60 * deltaTime;
        if (this.x < -(this.width / 2)) {
            this.Destroy();
        }
    }
    Draw(ctx, deltaTime) {
        ctx.drawImage(this.image, Math.round(this.x - this.width / 2), Math.round(this.y - this.height / 2));
    }
    OnDestroy() {
        AsteroideSpawner.instance.AsteroideOnDestroy(this);
    }
    OnCollisionEnter(other) {
        if (other.GetTag() === "Missile") {
            this.Destroy();
        }
    }
    OnCollisionExit(other) {
    }
}
