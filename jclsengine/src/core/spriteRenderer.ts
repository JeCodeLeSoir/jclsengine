/*
exmple json

"img": {
    "src": "http://localhost/SpaceTest/autre/pngfind.com-explosion-sprite-png-4289579.png",
    "w": 2049,
    "h": 1005,
    "guid": "e1b0a0e0-0a0a-0a0a-0a0a-0a0a0a0a0a0a"
  },
  "rects": [
    {
      "x": 0,
      "y": 0,
      "w": 256,
      "h": 251
    }
  ]
}

*/

import Vector2 from "./vector2.js";

export class Sprite {
  isLoaded: boolean = false;

  src: string = "";
  spriteid: number = 0;

  image: HTMLImageElement = new Image();

  height: number = 0;
  width: number = 0;

  imageSmoothingEnabled: boolean = false;

  rects: any[] = [];

  get IsLoad(): boolean {
    return this.isLoaded;
  }

  LoadJson(fileJson: string, callback: Function | null = null) {
    fetch(fileJson).then((response) =>
      response.json()
    ).then((data) => {
      this.src = data.img.src;
      this.height = data.img.h;
      this.width = data.img.w;
      this.rects = data.rects;
      this.LoadImage(callback);
    })
  }

  private LoadImage(callback: Function | null = null) {
    this.image.src = this.src;
    this.image.addEventListener('load', () => {
      this.height = this.image.height;
      this.width = this.image.width;

      if (callback != null) {
        callback();
        this.isLoaded = true;
      }

    })
  }

  GetSpriteById() {
    return {
      image: this.image,
      rect: this.rects[this.spriteid]
    }
  }

}

export class SpriteRenderer {

  private _isVisble: boolean = true;
  private _sprite: Sprite = new Sprite();

  SetSprite(sprite: Sprite) {
    this._sprite = sprite;
  }

  set isVisible(value: boolean) {
    this._isVisble = value;
  }

  get isVisible(): boolean {
    return this._isVisble;
  }

  Draw(ctx: CanvasRenderingContext2D,
    position: Vector2,
    rotation: number,
    size: Vector2
  ) {
    if (this._isVisble == false) return;

    const sprite = this._sprite.GetSpriteById();
    if (this._sprite.IsLoad == false) return;

    position.x = Math.round(position.x);
    position.y = Math.round(position.y);
    //size.x = Math.round(size.x);
    //size.y = Math.round(size.y);

    ctx.save();
    ctx.imageSmoothingEnabled = this._sprite.imageSmoothingEnabled;
    /* pixel perfect */

    ctx.translate(position.x, position.y);

    let _rotation = 90;

    let rad = _rotation * Math.PI / 180;
    ctx.rotate(rad);

    this.DrawImageRect(
      ctx,
      sprite.image,
      new Vector2(0, -(80)),
      size,
      {
        position: new Vector2(sprite.rect.x, sprite.rect.y),
        size: new Vector2(sprite.rect.w, sprite.rect.h)
      }
    )

    ctx.restore();
  }

  DrawImageRect(ctx, image, position: Vector2, size: Vector2, rect) {
    ctx.drawImage(image,
      rect.position.x, rect.position.y,
      rect.size.x, rect.size.y,
      position.x, position.y,
      size.x, size.y);

    /*ctx.drawImage(image, 250, 0,
       250, 250,
       0, 0,
       800, 800);*/
  }

}