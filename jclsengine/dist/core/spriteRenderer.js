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
    isLoaded = false;
    src = "";
    spriteid = 0;
    image = new Image();
    height = 0;
    width = 0;
    rotation = 90;
    imageSmoothingEnabled = false;
    rects = [];
    get IsLoad() {
        return this.isLoaded;
    }
    LoadJson(fileJson, callback = null) {
        fetch(fileJson).then((response) => response.json()).then((data) => {
            this.src = data.img.src;
            this.height = data.img.h;
            this.width = data.img.w;
            this.rects = data.rects;
            this.LoadImage(callback);
        });
    }
    LoadImage(callback = null) {
        this.image.src = this.src;
        this.image.addEventListener('load', () => {
            this.height = this.image.height;
            this.width = this.image.width;
            if (callback != null) {
                callback();
                this.isLoaded = true;
            }
        });
    }
    GetSpriteById() {
        return {
            image: this.image,
            rotation: this.rotation,
            rect: this.rects[this.spriteid]
        };
    }
}
export class SpriteRenderer {
    _isVisble = true;
    _sprite = new Sprite();
    SetSprite(sprite) {
        this._sprite = sprite;
    }
    set isVisible(value) {
        this._isVisble = value;
    }
    get isVisible() {
        return this._isVisble;
    }
    Draw(ctx, position, rotation, size, scale = new Vector2(1, 1)) {
        if (this._isVisble == false)
            return;
        const sprite = this._sprite.GetSpriteById();
        if (this._sprite.IsLoad == false)
            return;
        //console.log(sprite.rect.w)
        //console.log(sprite.rect.h)
        /**/
        let _x = position.x - (size.x / 2);
        let _y = position.y - (size.y / 2);
        let pivot_x = size.x / 2;
        let pivot_y = size.y / 2;
        ctx.save(); //1
        {
            ctx.translate(_x, _y);
            ctx.save(); //2
            {
                ctx.translate(pivot_x, pivot_y);
                ctx.rotate(rotation * Math.PI / 180);
                ctx.translate(-pivot_x, -pivot_y);
                ctx.save(); //3
                {
                    ctx.translate(pivot_x, pivot_y);
                    ctx.rotate(sprite.rotation * Math.PI / 180);
                    ctx.translate(-pivot_x, -pivot_y);
                    ctx.save(); //4
                    {
                        ctx.translate(pivot_x, pivot_y);
                        ctx.scale(scale.x, scale.y);
                        ctx.translate(-pivot_x, -pivot_y);
                        this.DrawImageRect(ctx, sprite.image, new Vector2(0, 0), size, {
                            position: new Vector2(sprite.rect.x, sprite.rect.y),
                            size: new Vector2(sprite.rect.w, sprite.rect.h)
                        });
                    }
                    ctx.restore(); //4
                }
                ctx.restore(); //3
            }
            ctx.restore(); //2
        }
        ctx.restore(); //1
    }
    DrawImageRect(ctx, image, position, size, rect) {
        ctx.save();
        ctx.drawImage(image, rect.position.x, rect.position.y, rect.size.x, rect.size.y, position.x, position.y, size.x, size.y);
        ctx.restore();
    }
}
