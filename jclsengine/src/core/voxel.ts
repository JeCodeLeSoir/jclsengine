import Vector2 from "./vector2";
export class PixelData {

  _id: number = 0;
  _color: number[] = [0, 0, 0, 0];
  _coord: number[] = [0, 0];
  _isVoid: boolean = false;

  _neighbor: PixelData[] = [];

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

export class EventVoxel extends Event {
  _voxel: Voxel;
  _group: Group[] = [];

  constructor(type: string, voxel: Voxel,
    group: Group[] = []) {
    super(type);
    this._voxel = voxel;
    this._group = group;
  }
}

export class Group {
  _pixelsData: PixelData[] = [];
  _color_group: number[] = [0, 0, 0, 0];

  get pixelsData(): PixelData[] {
    return this._pixelsData;
  }
}

export default class Voxel {
  _pixelsData: PixelData[] = [];

  _width: number = 0;
  _height: number = 0;


  OnEventChange: (e: Event) => void = (e) => { };

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }


  CreateVoxel(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null
      = canvas.getContext('2d');

    if (ctx === null) {
      throw new Error('CanvasRenderingContext2D is null');
    }

    canvas.width = img.width;
    canvas.height = img.height;

    this._width = canvas.width;
    this._height = canvas.height;

    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < data.length; i += 4) {

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      let coordX = i / 4 % canvas.width;
      let coordY = Math.floor(i / 4 / canvas.width);

      //[r, g, b, a]
      let p = new PixelData([255, 255, 255, 255],
        [coordX, coordY],
        a !== 255 ? true : false
      );

      p._id = this._pixelsData.length;

      this._pixelsData.push(p);
    }

    for (let i = 0; i < this._pixelsData.length; i++) {
      let p = this._pixelsData[i];

      /* 4-voisins (haut, bas, gauche, droite) */
      let neighborCoord: number[][] = [
        [p._coord[0], p._coord[1] - 1],  // Voisin du haut
        [p._coord[0], p._coord[1] + 1],  // Voisin du bas
        [p._coord[0] - 1, p._coord[1]],  // Voisin de gauche
        [p._coord[0] + 1, p._coord[1]],   // Voisin de droite
        [p._coord[0] - 1, p._coord[1] - 1],  // Voisin du haut gauche
        [p._coord[0] + 1, p._coord[1] - 1],  // Voisin du haut droite
        [p._coord[0] - 1, p._coord[1] + 1],  // Voisin du bas gauche
        [p._coord[0] + 1, p._coord[1] + 1],   // Voisin du bas droite
      ];

      let neighbor: PixelData[] = [];

      for (let j = 0; j < neighborCoord.length; j++) {
        let x = neighborCoord[j][0];
        let y = neighborCoord[j][1];

        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {

          let id = Math.floor(x + y * canvas.width);

          let p_neighbor = this._pixelsData[id];

          if (p_neighbor) {
            neighbor.push(p_neighbor);
          }

        }
      }

      p._neighbor = neighbor;
    }
  }


  setVoid(coord: number[], isVoid: boolean) {
    let p = this._pixelsData.find(p => p._coord[0] === coord[0] && p._coord[1] === coord[1]);
    if (p) {
      p._isVoid = isVoid;
      this.OnEventChange(new EventVoxel("change", this,
        this.ColorPropagation()));
    }
  }

  ColorPropagation(): Group[] {
    let _pixels = this._pixelsData;
    let _pixels_ispropagated: boolean[]
      = [];

    let Groups: Group[] = [];

    // recuperer le pixel au centre de l'image

    /*let x = Math.floor(this._width / 2);
    let y = Math.floor(this._height / 2);

    let idp = Math.floor(x + y * this._width);

    let p = _pixels[idp];

    p._color = [255, 0, 0, 255];

    p._neighbor.forEach(p_neighbor => {
      p_neighbor._color = [255, 0, 0, 255];
    });*/

    let maxGroup = 10;

    let colorlist: number[][] = [
      [255, 0, 0, 255], //1
      [0, 255, 0, 255], //2
      [0, 0, 255, 255], //3
      [255, 255, 0, 255], //4
      [255, 0, 255, 255], //5
      [0, 255, 255, 255], //6
      [255, 255, 255, 255], //7 
      [0, 0, 0, 255], //8
      [128, 128, 128, 255], //9
      [128, 0, 0, 255], //10
    ];

    let colorlist_index = 0;

    let propagation = (p: PixelData, group: Group) => {

      if (p._isVoid === true)
        return;

      _pixels_ispropagated[p._id] = true;

      group._pixelsData.push(p);

      p._color = group._color_group;

      for (let i = 0; i < p._neighbor.length; i++) {
        let p_neighbor = p._neighbor[i];

        if (_pixels_ispropagated[p_neighbor._id] === true)
          continue;

        propagation(p_neighbor, group);
      }
    }

    for (let i = 0; i < _pixels.length; i++) {
      let p = _pixels[i];

      if (p._isVoid === true)
        continue;

      let color = colorlist[colorlist_index];
      let group = new Group();
      group._color_group = color;

      if (_pixels_ispropagated[p._id] === true)
        continue;

      propagation(p, group);
      Groups.push(group);

      colorlist_index = (colorlist_index + 1) % maxGroup;
    }

    return Groups;
  }

  Draw(ctx: CanvasRenderingContext2D, position: Vector2, scale: Vector2) {
    for (let i = 0; i < this._pixelsData.length; i++) {
      let p = this._pixelsData[i];
      if (!p._isVoid) {
        /* dessine le pixel */
        ctx.fillStyle = `rgba(${p._color[0]},${p._color[1]},${p._color[2]},${p._color[3]})`;
        ctx.fillRect(
          p._coord[0] * scale.x + position.x,
          p._coord[1] * scale.y + position.y,
          scale.x,
          scale.y
        );
      }
    }
  }



}