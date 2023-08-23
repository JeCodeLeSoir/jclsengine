import * as jcls from "jclsengine"
import Missile from "./missile.js";

export default class Ship extends jcls.Behavior {

  static instance: Ship;

  protected Tag: string = "Player";
  protected IsPhysics: boolean = true;
  protected DisplayOrder: number = 2;

  //image: HTMLImageElement;
  height: number = 60;
  width: number = 60;

  private _spriteRenderer: jcls.SpriteRenderer | null = null;
  private _sprite: jcls.Sprite | null = null;

  speed: number;

  cooldown: number = 0;
  cooldownMax: number = 0.5;

  score: number = 0;
  life: number = 3;

  constructor() {
    super();
    this.position.x = 25;
    this.position.y = jcls.Behavior_Instance.SCREEN_HEIGHT / 2;
    this.speed = 150;

    //this.image = new Image();
    Ship.instance = this;
    console.log("Ship created");

    //this.Instantiate(new Missile(), this);
  }

  Load() {
    this._spriteRenderer = new jcls.SpriteRenderer();
    this._sprite = new jcls.Sprite();

    this._sprite.LoadJson('./assets/json/player.json', () => {
      this._spriteRenderer?.SetSprite(this._sprite!);
      this.shap = new jcls.Box(
        this.width, this.height
      );

      this.shap.center = this.position;
      this.shap.rotation = this.rotation;

      this.setIsLoaded(true);
      this.InitPhysics();
      if (this.physicsCollider !== null)
        this.physicsCollider.LayerName = "Player";
    })

    /* this.image.src = './assets/player.png';
     this.image.addEventListener('load', () => {
       this.height = this.image.height;
       this.width = this.image.width;
 
       this.boundingBox = new jcls.Bounds(new
         jcls.Vector2(this.position.x, this.position.y), new
         jcls.Vector2(this.width, this.height));
     })*/


  }

  Update(deltaTime: number) {


    //* set velocity to zero
    if (this.physicsCollider !== null)
      this.physicsCollider.velocity = new jcls.Vector2(0, 0);

    const h = jcls.Behavior_Instance.SCREEN_HEIGHT;
    const w = jcls.Behavior_Instance.SCREEN_WIDTH;

    if (jcls.Input.GetInput(jcls.EInput.forward)
      && this.position.y - this.height / 2 > 0
    ) {
      this.position.y -= this.speed * deltaTime;
    }

    if (jcls.Input.GetInput(jcls.EInput.backward)
      && this.position.y + this.height / 2 < h
    ) {
      this.position.y += this.speed * deltaTime;
    }
    if (jcls.Input.GetInput(jcls.EInput.left)
      && this.position.x - this.width / 2 > 0
    ) {
      this.position.x -= this.speed * deltaTime;
    }
    if (jcls.Input.GetInput(jcls.EInput.right)
      && this.position.x + this.width / 2 < w
    ) {
      this.position.x += this.speed * deltaTime;
    }

    if (jcls.Input.GetInput(jcls.EInput.space)) {
      if (this.cooldown <= 0) {
        this.cooldown = this.cooldownMax;

        /*let m = this.Instantiate(
          this.missile.Copy()
        );
        m.SetPosition(
          new jcls.Vector2(this.position.x + this.width / 2, this.position.y)
        );
        m.IsEnabled = true;*/
        //console.log(jcls.BehaviorPooling.Instance)

        let m: jcls.Behavior = jcls.BehaviorPooling.Instance.Get("Missile");

        if (m.physicsCollider !== null)
          m.physicsCollider.velocity = new jcls.Vector2(0, 0);

        m.SetPosition(
          new jcls.Vector2(this.position.x + this.width / 2, this.position.y)
        );

        console.log(m);

        //console.log(jcls.BehaviorPooling.Instance)
      }
    }

    this.cooldown -= deltaTime;
    this.score += 0.025 * deltaTime;

  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    let x = Math.round(this.position.x - this.width / 2)
    let y = Math.round(this.position.y - this.height / 2)

    this._spriteRenderer?.Draw(ctx,
      new jcls.Vector2(x, y),
      this.rotation,
      new jcls.Vector2(this.width, this.height),
    );

    /*ctx.drawImage(this.image,

    );*/
  }

  OnDestroy(): void {
    //window.location.reload();
  }

  OnCollisionEnter(other: jcls.Behavior): void {
    if (other.GetTag() === "Asteroide") {
      //this.Destroy();
      this.life -= 1;
    }
  }
}