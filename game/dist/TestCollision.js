import * as jcls from "jclsengine";
import Tags from "./tags.js";
export default class TestCollision extends jcls.Behavior {
    Tag = Tags.TestCollision;
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
            this.physicsCollider.mass = 10; //Math.PI * this.width * this.height;
            //console.log(this.physicsCollider.mass);
            this.InitPhysics();
            if (this.physicsCollider !== null)
                this.physicsCollider.LayerName = "Asteroide";
            this.position = new jcls.Vector2((jcls.Behavior_Instance.SCREEN_WIDTH / 2) - this.width, (jcls.Behavior_Instance.SCREEN_HEIGHT / 2) - this.height);
            this.setIsLoaded(true);
        });
    }
    Update(deltaTime) {
        /* this.position.x -= 60 * deltaTime;
         if (this.position.x < - (this.width / 2)) {
           this.Destroy();
         }*/
    }
    Draw(ctx, deltaTime) {
        ctx.drawImage(this.image, Math.round(this.position.x - this.width / 2), Math.round(this.position.y - this.height / 2));
    }
    OnDestroy() {
        //AsteroideSpawner.instance.AsteroideOnDestroy(this);
    }
    OnCollisionEnter(other) {
    }
}
