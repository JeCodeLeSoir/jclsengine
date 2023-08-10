import * as jcls from "jclsengine";
import Missile from "./missile.js";
export var Input;
(function (Input) {
    Input[Input["forward"] = 0] = "forward";
    Input[Input["backward"] = 1] = "backward";
    Input[Input["left"] = 2] = "left";
    Input[Input["right"] = 3] = "right";
    Input[Input["space"] = 4] = "space";
    Input[Input["shift"] = 5] = "shift";
})(Input || (Input = {}));
export default class Ship extends jcls.Behavior {
    static instance;
    Tag = "Player";
    IsPhysics = true;
    DisplayOrder = 2;
    image;
    height = 0;
    width = 0;
    speed;
    rotation;
    inputs = [];
    cooldown = 0;
    cooldownMax = 0.5;
    score = 0;
    constructor() {
        super();
        this.position.x = 25;
        this.position.y = jcls.Behavior_Instance.SCREEN_HEIGHT / 2;
        this.speed = 150;
        this.rotation = 0;
        this.image = new Image();
        Ship.instance = this;
        console.log("Ship created");
    }
    Load() {
        this.image.src = './assets/player.png';
        this.image.addEventListener('load', () => {
            this.height = this.image.height;
            this.width = this.image.width;
            this.boundingBox = new jcls.Bounds(new jcls.Vector2(this.position.x, this.position.y), new jcls.Vector2(this.width, this.height));
            this.setIsLoaded(true);
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'z') {
                this.inputs[Input.forward] = true;
            }
            if (e.key === 'ArrowDown' || e.key === 's') {
                this.inputs[Input.backward] = true;
            }
            if (e.key === 'ArrowLeft' || e.key === 'q') {
                this.inputs[Input.left] = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                this.inputs[Input.right] = true;
            }
            if (e.key === ' ') {
                this.inputs[Input.space] = true;
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'z') {
                this.inputs[Input.forward] = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's') {
                this.inputs[Input.backward] = false;
            }
            if (e.key === 'ArrowLeft' || e.key === 'q') {
                this.inputs[Input.left] = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                this.inputs[Input.right] = false;
            }
            if (e.key === ' ') {
                this.inputs[Input.space] = false;
            }
        });
    }
    Update(deltaTime) {
        const h = jcls.Behavior_Instance.SCREEN_HEIGHT;
        const w = jcls.Behavior_Instance.SCREEN_WIDTH;
        if (this.inputs[Input.forward]
            && this.position.y - this.height / 2 > 0) {
            this.position.y -= this.speed * deltaTime;
        }
        if (this.inputs[Input.backward]
            && this.position.y + this.height / 2 < h) {
            this.position.y += this.speed * deltaTime;
        }
        if (this.inputs[Input.left]
            && this.position.x - this.width / 2 > 0) {
            this.position.x -= this.speed * deltaTime;
        }
        if (this.inputs[Input.right]
            && this.position.x + this.width / 2 < w) {
            this.position.x += this.speed * deltaTime;
        }
        if (this.inputs[Input.space]) {
            if (this.cooldown <= 0) {
                this.cooldown = this.cooldownMax;
                this.Instantiate(new Missile()).SetPosition(new jcls.Vector2(this.position.x + this.width / 2, this.position.y));
            }
        }
        this.cooldown -= deltaTime;
        this.score += 0.025 * deltaTime;
    }
    Draw(ctx, deltaTime) {
        ctx.drawImage(this.image, Math.round(this.position.x - this.width / 2), Math.round(this.position.y - this.height / 2));
    }
    OnDestroy() {
        window.location.reload();
    }
    OnCollisionEnter(other) {
        if (other.GetTag() === "Asteroide") {
            this.Destroy();
        }
    }
}
