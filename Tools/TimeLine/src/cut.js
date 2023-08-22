
export default class CutImage {


  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.visibility = 'hidden';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  CutImage(src, size, rx, ry, rw, rh, callback) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.canvas.width = size;
      this.canvas.height = size;
      this.DrawImageRect(
        this.ctx,
        img,
        {
          x: 0,
          y: 0
        },
        {
          x: size,
          y: size
        }
        ,
        {
          position: {
            x: rx,
            y: ry
          },
          size: {
            x: rw,
            y: rh
          }
        }
      );
      callback(this.canvas.toDataURL('image/png'));
    };
  }

  DrawImageRect(ctx, image, position, size, rect) {
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



  Dispose() {
    document.body.removeChild(this.canvas);
  }

}