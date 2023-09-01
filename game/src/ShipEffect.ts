import * as jcls from "jclsengine"

export default class ShipEffect extends jcls.Behavior {
  OnDestroy(): void {

  }

  protected IsPhysics: boolean = false;
  protected DisplayOrder: number = 1;

  height: number = 60;
  width: number = 60;
  scale: jcls.Vector2;

  private _spriteRenderer: jcls.SpriteRenderer | null = null;
  private _sprite: jcls.Sprite | null = null;

  constructor(parent: jcls.Behavior) {
    super();

    this.scale = new jcls.Vector2(1, 1);
    //this.image = new Image();
    this.rotation = 0;
    this.position = new jcls.Vector2(
      -40,
      0
    );

    this.SetParent(parent);
  }

  Load() {
    this._spriteRenderer = new jcls.SpriteRenderer();
    this._sprite = new jcls.Sprite();

    this._sprite.LoadJson('./assets/json/player.json', () => {

      if (this._sprite)
        this._sprite.spriteid = 1;

      this._spriteRenderer?.SetSprite(this._sprite!);

      this.setIsLoaded(true);
    })

    /* this.image.src = './assets/missile.png';
    this.image.addEventListener('load', () => {
      this.height = this.image.height;
      this.width = this.image.width;
      this.setIsLoaded(true);
    })*/
  }

  Update(deltaTime: number) {
    this.scale.x -= 2 * deltaTime;
    if (this.scale.x <= 0.7)
      this.scale.x = 1;
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    /* ctx.drawImage(this.image,
       Math.round(this.position.x - this.width / 2),
       Math.round(this.position.y - this.height / 2)
     );*/

    let x = Math.round(this.position.x)
    let y = Math.round(this.position.y)

    this._spriteRenderer?.Draw(ctx,
      new jcls.Vector2(x, y),
      this.rotation,
      new jcls.Vector2(this.width, this.height),
      this.scale
    );
  }
}