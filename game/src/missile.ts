import * as jcls from "jclsengine"
import Ship from "./ship.js";

export default class Missile extends jcls.Behavior {

  protected IsPhysics: boolean = true;
  protected Tag: string = "Missile";

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

      this.boundingBox = new jcls.Bounds(new
        jcls.Vector2(this.position.x, this.position.y), new
        jcls.Vector2(this.width, 10));

      this._clipExplosion.Load('./assets/sounds/8-bit Explosion.mp3');

      this.setIsLoaded(true);
    })
  }

  Update(deltaTime: number) {
    if (this.inverted) {
      this.position.x -= this.speed * deltaTime;
      if (this.position.x < -this.width / 2) {
        this.Destroy();
      }
    }
    else {
      this.position.x += this.speed * deltaTime;
      if (this.position.x > jcls.Behavior_Instance.SCREEN_WIDTH + 2) {
        this.Destroy();
      }
    }
  }

  OnDestroy(): void {

  }

  OnCollisionEnter(other: jcls.Behavior): void {
    if (this.Tag === "Missile") {
      if (other.GetTag() === "Asteroide") {
        this._soundEffect.PlayOneShot(this._clipExplosion);
        this.Destroy();
        Ship.instance.score += 100;
      }
    }
    else {
      if (other.GetTag() === "Player") {
        this._soundEffect.PlayOneShot(this._clipExplosion);
        this.Destroy();
        other.Destroy();
      }
    }
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