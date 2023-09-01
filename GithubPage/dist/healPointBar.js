import * as jcls from "jclsengine";
export default class HealPointBar extends jcls.Behavior {
    IsPhysics = false;
    static instance;
    static SetHealPointBar(health) {
        HealPointBar.instance.health = health;
    }
    health = 3;
    maxHealth = 3;
    healDrawText = "❤️";
    PowerDrawText = "🔋";
    healDrawTextHeight = 0;
    powerDrawTextHeight = 0;
    _text = "";
    width = 0;
    OnDestroy() {
    }
    constructor() {
        super();
        this.position.x = 10;
        this.position.y = 10;
        HealPointBar.instance = this;
    }
    Init(ctx) {
        let metrics = ctx.measureText(this.healDrawText);
        let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        this.healDrawTextHeight = actualHeight;
    }
    Load() {
        //this.InitPhysics();
        this.setIsLoaded(true);
    }
    Update(deltaTime) {
        /* fix position to camera */
        this.position.x = 10;
        this.position.y = 25 + (this.healDrawTextHeight / 2);
        this._text = "";
        for (let i = 0; i < this.maxHealth; i++) {
            if (i < this.health) {
                this._text += this.healDrawText;
            }
        }
    }
    Draw(ctx, deltaTime) {
        this.width = ctx.measureText(this._text).width;
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(this._text, this.position.x, this.position.y);
    }
}
