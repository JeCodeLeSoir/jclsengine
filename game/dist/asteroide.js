import * as jcls from "jclsengine";
import AsteroideSpawner from "./asteroideSpawner.js";
export default class Asteroide extends jcls.Behavior {
    Tag = "Asteroide";
    DisplayOrder = -1;
    IsPhysics = true;
    image;
    height = 0;
    width = 0;
    constructor() {
        super();
        this.image = new Image();
    }
    Load() {
        this.image.src = './assets/asteroide.png';
        this.image.addEventListener('load', () => {
            this.height = this.image.height;
            this.width = this.image.width;
            /*this.boundingBox = new jcls.Bounds(
              new jcls.Vector2(this.position.x, this.position.y),
              new jcls.Vector2(this.width, this.height));*/
            this.shap = new jcls.Box(this.width, this.height);
            this.shap.center = this.position;
            this.shap.rotation = this.rotation;
            this.physicsCollider = new jcls.PhysicsCollider2d();
            this.physicsCollider.mass = Math.PI * this.width * this.height;
            console.log(this.physicsCollider.mass);
            this.setIsLoaded(true);
            this.InitPhysics();
        });
    }
    Update(deltaTime) {
        this.position.x -= 60 * deltaTime;
        if (this.position.x < -(this.width / 2)) {
            this.Destroy();
        }
    }
    Draw(ctx, deltaTime) {
        ctx.drawImage(this.image, Math.round(this.position.x - this.width / 2), Math.round(this.position.y - this.height / 2));
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
