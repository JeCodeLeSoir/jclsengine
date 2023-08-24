export class PixelData {
  _color: number[] = [0, 0, 0, 0];
  _coord: number[] = [0, 0];
  _isVoid: boolean = false;

  constructor(
    color: number[],
    coord: number[],
    isVoid: boolean
  ) {
    this._color = color;
    this._coord = coord;
    this._isVoid = isVoid;
  }

}

export default class Voxel {
  _pixelsData: PixelData[] = [];


  CreateVoxel(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null
      = canvas.getContext('2d');

    if (ctx === null) {
      throw new Error('CanvasRenderingContext2D is null');
    }
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      let coordX = i / 4 % canvas.width;
      let coordY = Math.floor(i / 4 / canvas.width);

      let p = new PixelData(
        [r, g, b, a],
        [coordX, coordY],
        a !== 255 ? true : false
      );
      this._pixelsData.push(p);

    }
  }


  DrawVoxel(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    for (let i = 0; i < this._pixelsData.length; i++) {
      let p = this._pixelsData[i];
      if (!p._isVoid) {
        ctx.fillStyle = `rgba(${p._color[0]},${p._color[1]},${p._color[2]},${p._color[3]})`;
        ctx.fillRect(
          p._coord[0] * scale + x,
          p._coord[1] * scale + y,
          scale,
          scale
        );
      }
    }
  }
}