import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";
import Ship from "./ship.js";
export default class Missile extends Behavior {
    IsPhysics = true;
    Tag = "Missile";
    image;
    height = 0;
    width = 0;
    speed = 300;
    constructor() {
        super();
        this.image = new Image();
    }
    Load() {
        this.image.src = './missile.png';
        this.image.addEventListener('load', () => {
            this.height = this.image.height;
            this.width = this.image.width;
            this.boundingBox = new Bounds(new Vector2(this.x, this.y), new Vector2(this.width, 10));
            this.setIsLoaded(true);
        });
    }
    Update(deltaTime) {
        this.x += this.speed * deltaTime;
        if (this.x > Behavior_Instance.SCREEN_WIDTH + (this.width / 2)) {
            this.Destroy();
        }
    }
    OnDestroy() {
    }
    OnCollisionEnter(other) {
        if (other.GetTag() === "Asteroide") {
            this.Destroy();
            Ship.instance.score += 100;
        }
    }
    Draw(ctx, deltaTime) {
        ctx.drawImage(this.image, Math.round(this.x - this.width / 2), Math.round(this.y - this.height / 2));
    }
}
