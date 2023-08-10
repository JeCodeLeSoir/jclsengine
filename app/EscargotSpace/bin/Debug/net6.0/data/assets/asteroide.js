import AsteroideSpawner from "./asteroideSpawner.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";
export default class Asteroide extends Behavior {
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
}
