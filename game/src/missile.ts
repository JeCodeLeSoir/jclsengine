import * as jcls from "jclsengine"
import Ship from "./ship.js";
import Tags from "./tags.js";

export default class Missile extends jcls.Behavior {

  protected IsPhysics: boolean = true;
  protected Tag: jcls.Tags = Tags.Player_Missile;

  inverted: boolean = false;

  setInverted(inverted: boolean) {
    this.inverted = inverted;
  }

  image: HTMLImageElement;

  height: number = 0;
  width: number = 0;

  speed: number = 300;

  constructor() {
    super();
    this.image = new Image();
  }

  _clipExplosion: jcls.Clip = new jcls.Clip();
  _soundEffect: jcls.SoundEffect = new jcls.SoundEffect();

  Load() {


    this.image.src = './assets/missile.png';
    this.image.addEventListener('load', () => {
      this.height = this.image.height;
      this.width = this.image.width;

      /*this.boundingBox = new jcls.Bounds(new
        jcls.Vector2(this.position.x, this.position.y), new
        jcls.Vector2(this.width, 10));*/

      this.shap = new jcls.Box(
        this.width,
        this.height
      );
      this.shap.center = this.position;
      this.shap.rotation = this.rotation;


      this._clipExplosion.Load('./assets/sounds/8bitexplosion.mp3');

      this.setIsLoaded(true);

      this.InitPhysics();

      if (this.physicsCollider !== null)
        this.physicsCollider.LayerName = "Missile_Player";
    })

  }

  Update(deltaTime: number) {
    /*if (this.inverted) {
      this.position.x -= this.speed * deltaTime;
      if (this.position.x < -this.width / 2) {
        //this.Destroy();
        jcls.BehaviorPooling.Instance.Free(this);
      }
    }
    else {
      this.position.x += this.speed * deltaTime;
      if (this.position.x > jcls.Behavior_Instance.SCREEN_WIDTH + 2) {
        //this.Destroy();
        jcls.BehaviorPooling.Instance.Free(this);
      }
    }*/
  }

  OnDestroy(): void {

  }

  OnCollisionEnter(other: jcls.Behavior): void {
    console.log("OnCollisionEnter: " + other.GetTag());

    if (other.GetTag() === Tags.Asteroide) {
      Ship.instance.score += 100;
      jcls.BehaviorPooling.Instance.Free(this);
      this._soundEffect.PlayOneShot(this._clipExplosion);
    }

    if (other.GetTag() === Tags.Enemy) {
      this._soundEffect.PlayOneShot(this._clipExplosion);
    }

    /*if (this.Tag === "Missile") {
     
    }
    else {
      if (other.GetTag() === "Player") {
        this._soundEffect.PlayOneShot(this._clipExplosion);
        //this.Destroy();
        jcls.BehaviorPooling.Instance.Free(this);
        other.Destroy();

      }
    }*/
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {

    if (this.inverted) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(this.image,
        Math.round(-this.position.x - this.width / 2),
        Math.round(this.position.y - this.height / 2)
      );
      ctx.restore();
    }
    else {
      ctx.drawImage(this.image,
        Math.round(this.position.x - this.width / 2),
        Math.round(this.position.y - this.height / 2)
      );
    }
  }

}