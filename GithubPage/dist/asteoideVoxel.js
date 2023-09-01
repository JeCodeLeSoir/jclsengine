import * as jcls from "jclsengine";
import Tags from "./tags.js";
export default class AsteoideVoxel extends jcls.Behavior {
    Tag = Tags.Asteroide;
    DisplayOrder = -1;
    IsPhysics = true;
    image;
    height = 0;
    width = 0;
    voxel;
    scale;
    constructor() {
        super();
        this.image = new Image();
        this.voxel = new jcls.Voxel();
        this.scale = jcls.Vector2.one.Multiply(8);
        this.position = new jcls.Vector2((jcls.Behavior_Instance.SCREEN_WIDTH / 2) - 100, (jcls.Behavior_Instance.SCREEN_HEIGHT / 2) - 100);
    }
    LoadByVoxel(_pixelsData) {
        this.voxel = new jcls.Voxel();
        this.voxel._pixelsData = _pixelsData;
        this.shap = new jcls.Box(10 * this.scale.x, 10 * this.scale.y);
        this.shap.center = this.position;
        this.shap.rotation = 0;
        this.physicsCollider = new jcls.PhysicsCollider2d();
        this.physicsCollider.mass = 1;
        this.setIsLoaded(true);
        this.InitPhysics();
        if (this.physicsCollider !== null)
            this.physicsCollider.LayerName = "Asteroide";
    }
    Load() {
        this.image.src = './assets/asteroide.png';
        this.image.addEventListener('load', () => {
            this.voxel.CreateVoxel(this.image);
            this.voxel.OnEventChange = (e) => {
                //console.log("event : ", e);
                if (e instanceof jcls.EventVoxel) {
                    //console.log(e._group);
                    if (e._group.length > 0) {
                        console.log("découper asteoideVoxel");
                        for (let i = 0; i < e._group.length; i++) {
                            let _a = new AsteoideVoxel();
                            _a.LoadByVoxel(e._group[i]._pixelsData);
                            this.Instantiate(_a, null, true);
                        }
                        this.Destroy();
                    }
                }
            };
            this.height = this.image.height;
            this.width = this.image.width;
            this.shap = new jcls.Box(10 * this.scale.x, 10 * this.scale.y);
            this.shap.center = this.position;
            this.shap.rotation = 0;
            this.physicsCollider = new jcls.PhysicsCollider2d();
            this.physicsCollider.mass = 1;
            //console.log(this.physicsCollider.mass);
            console.log("Create Physics asteoideVoxel");
            this.setIsLoaded(true);
            this.InitPhysics();
            if (this.physicsCollider !== null)
                this.physicsCollider.LayerName = "Asteroide";
        });
    }
    Update(deltaTime) {
        if (jcls.Input.GetButton(0)) {
            /*
              exemple du calcule de coordonnée
      
              p._coord[0] * scale.x + position.x,
              p._coord[1] * scale.y + position.y,
            */
            let mouseCoord = jcls.Input.GetMouseCoord();
            /*
              dertemine la coordonnée du pixel a modifier
            */
            let coord = [
                Math.floor((mouseCoord.x - this.position.x) / this.scale.x),
                Math.floor((mouseCoord.y - this.position.y) / this.scale.y)
            ];
            /*console.log("canvas width : ", jcls.Behavior_Instance.SCREEN_WIDTH)
            console.log("canvas height : ", jcls.Behavior_Instance.SCREEN_HEIGHT)
      
            console.log("mouseCoord : ", mouseCoord);
            console.log("position : ", this.position);
            console.log("scale : ", this.scale);
            console.log("coord : ", coord);*/
            this.voxel.setVoid(coord, true);
        }
    }
    Draw(ctx, deltaTime) {
        let mouseCoord = jcls.Input.GetMouseCoord();
        /* debug mouse coord */
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(mouseCoord.x, mouseCoord.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        this.voxel.Draw(ctx, this.position, this.scale);
    }
    OnDestroy() {
    }
    OnCollisionEnter(other) {
    }
}
