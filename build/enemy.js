import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";
export default class Enemy extends Behavior {
    static instance;
    Tag = "player";
    IsPhysics = true;
    DisplayOrder = 2;
    image;
    height = 0;
    width = 0;
    speed;
    rotation;
    cooldown = 0;
    cooldownMax = 0.5;
    score = 0;
    constructor() {
        super();
        this.x = 25;
        this.y = Behavior_Instance.SCREEN_HEIGHT / 2;
        this.speed = 150;
        this.rotation = 0;
        this.image = new Image();
        Enemy.instance = this;
    }
    Load() {
        this.image.src = './player.png';
        this.image.addEventListener('load', () => {
            this.height = this.image.height;
            this.width = this.image.width;
            this.boundingBox = new Bounds(new Vector2(this.x, this.y), new Vector2(this.width, this.height));
            this.setIsLoaded(true);
        });
    }
    Update(deltaTime) {
        this.cooldown -= deltaTime;
        this.score += 0.025 * deltaTime;
    }
    Draw(ctx, deltaTime) {
        ctx.drawImage(this.image, Math.round(this.x - this.width / 2), Math.round(this.y - this.height / 2));
    }
    OnDestroy() {
        window.location.reload();
    }
    OnCollisionEnter(other) {
        if (other.GetTag() === "player") {
            this.Destroy();
        }
        if (other.GetTag() === "Missile") {
            this.Destroy();
        }
    }
}
