import Rect from './rect.js';
import Vector2 from './vector2.js';

const ScaleZoom = 100;

class View {

  constructor(canvas, content = "") {
    this.canvas = canvas;
    this.Inputs = [];
    this.Rects = [];
    this.newRect = undefined;
    this.lastRect = undefined;

    this.position = new Vector2();
    this.center = new Vector2();
    this.zoom = ScaleZoom;

    this.dragCamera = false;

    this.img = new Image();

    if (content === "") {
      this.img.width = 1024;
      this.img.height = 1024;
    }
    else {
      this.img.src = content;
    }

    this.RectInfos = document.querySelector('.RectInfos');

    this.img.onload = () => {
      console.log(this.img.width, this.img.height);
    }

    document.addEventListener('keydown', (e) => this.KeyDown(e));
    document.addEventListener('keyup', (e) => this.KeyUp(e));
    document.addEventListener('wheel', (e) => this.OnWheel(e));

    this.canvas.addEventListener('pointermove', (e) => this.OnPointerMove(e));
    this.canvas.addEventListener('pointerup', (e) => this.OnPointerUp(e));
    this.canvas.addEventListener('pointerdown', (e) => this.OnPointerDown(e));

  }

  OnPointerDown(e) {

    Rect.LastSelection = null;

    let rect = this.canvas.getBoundingClientRect();
    let mouse_canvasX = e.clientX - rect.left;
    let mouse_canvasY = e.clientY - rect.top;

    if (e.button === 1) {
      this.dragCamera = true;
      return;
    }

    if (e.button === 0
      && this.Inputs["Shift"] === true
    ) {
      this.newRect = new Rect();

      this.newRect.End.x = mouse_canvasX
      this.newRect.End.y = mouse_canvasY

      this.newRect.Start.x = mouse_canvasX
      this.newRect.Start.y = mouse_canvasY
      return;
    }

    if (e.button === 0) {
      let sortedRectSaves = [...this.Rects].sort((a, b) => {
        const sizeA = a.size.x * a.size.y;
        const sizeB = b.size.x * b.size.y;
        return sizeB - sizeA;
      });

      sortedRectSaves = sortedRectSaves.reverse();
      sortedRectSaves.forEach((rect) => rect.Reset());

      for (let i = 0; i < sortedRectSaves.length; i++) {

        sortedRectSaves[i].CheckSelection(
          mouse_canvasX,
          mouse_canvasY,
          e.clientX, e.clientY,
          this.center,
          this.position,
          this.zoom
        );

        if (sortedRectSaves[i] === Rect.LastSelection) {

          this.RectInfos.classList.remove('hide');

          this.RectInfos.querySelector('#x').value = sortedRectSaves[i].position.x;
          this.RectInfos.querySelector('#y').value = sortedRectSaves[i].position.y;

          this.RectInfos.querySelector('#w').value = sortedRectSaves[i].size.x;
          this.RectInfos.querySelector('#h').value = sortedRectSaves[i].size.y;

          this.RectInfos.querySelector('#px').value = sortedRectSaves[i].Pivot.x;
          this.RectInfos.querySelector('#py').value = sortedRectSaves[i].Pivot.y;

          this.lastRect = sortedRectSaves[i].Clone();
          return;
        }
      }
    }

  }

  OnPointerUp(e) {

    if (this.dragCamera == true) {
      this.dragCamera = false;
      return;
    }

    this.Rects.forEach((rect) => rect.Reset());
    this.Rects.forEach((rect) => rect.ReCalculeRect());

    let rect = this.canvas.getBoundingClientRect();
    let mouse_canvasX = e.clientX - rect.left;
    let mouse_canvasY = e.clientY - rect.top;

    if (e.button === 0
      && this.newRect !== undefined
    ) {

      this.newRect.Create(
        this.Rects.length + 1,
        this.center,
        this.position,
        this.zoom
      );

      this.Rects.push(this.newRect);
      this.newRect = undefined;
      return;
    }

  }

  OnPointerMove(e) {





    if (Rect.LastSelection !== null) {

      this.RectInfos.querySelector('#name').value = Rect.LastSelection.name;

      this.RectInfos.querySelector('#x').value = Rect.LastSelection.position.x;
      this.RectInfos.querySelector('#y').value = Rect.LastSelection.position.y;
      this.RectInfos.querySelector('#w').value = Rect.LastSelection.size.x;
      this.RectInfos.querySelector('#h').value = Rect.LastSelection.size.y;
      this.RectInfos.querySelector('#px').value = Rect.LastSelection.Pivot.x;
      this.RectInfos.querySelector('#py').value = Rect.LastSelection.Pivot.y;


      let pivotx = (Rect.LastSelection.Pivot.x / (Rect.LastSelection.size.x * this.zoom)) / 0.5;
      let pivoty = (Rect.LastSelection.Pivot.y / (Rect.LastSelection.size.y * this.zoom)) / 0.5;

      this.RectInfos.querySelector('#pxa').value = pivotx;
      this.RectInfos.querySelector('#pya').value = pivoty;
    }

    let rect = this.canvas.getBoundingClientRect();

    let mouse_canvasX = e.clientX - rect.left;
    let mouse_canvasY = e.clientY - rect.top;

    if (this.dragCamera) {
      this.position.x += e.movementX;
      this.position.y += e.movementY;
    }

    if (this.newRect !== undefined) {
      this.newRect.End.x = mouse_canvasX
      this.newRect.End.y = mouse_canvasY
    }

    for (let i = 0; i < this.Rects.length; i++) {
      this.Rects[i].Resize(new Vector2(e.clientX, e.clientY), this.center, this.zoom);
      if (this.Rects[i].IsMovePivot) {
        this.Rects[i].MovePivot(
          new Vector2(e.movementX, e.movementY),
          this.center,
          this.zoom,
          this.img.width,
          this.img.height
        );

      }
      else {
        this.Rects[i].MoveSelection(
          new Vector2(e.movementX, e.movementY),
          this.center,
          this.zoom,
          this.img.width,
          this.img.height
        );
      }
    }


  }

  OnWheel(e) {
    this.zoom -= 0.1 * e.deltaY;
    this.zoom = this.Range(10, 500, this.zoom)
  }

  Range(min, max, value) {
    return Math.min(Math.max(min, value), max);
  }

  KeyDown(e) {
    this.Inputs[e.key] = true;
  }

  KeyUp(e) {
    this.Inputs[e.key] = false;
  }

  SaveFile() {
    const adjustedRects = [];
    const zoom = 100;

    for (let i = 0; i < this.Rects.length; i++) {
      const rect = this.Rects[i];
      let rect_Relative = this.GetRelativeRect(rect,
        1,
        zoom
      );
      const adjustedRect = {
        x: Math.round(rect_Relative.position.x),
        y: Math.round(rect_Relative.position.y),
        w: Math.round(rect_Relative.size.x),
        h: Math.round(rect_Relative.size.y),
        px: Math.round(rect_Relative.pivot.x),
        py: Math.round(rect_Relative.pivot.y),
        id: rect.id,
        name: rect.name
      };

      adjustedRects.push(adjustedRect);
    }

    let json = JSON.stringify({
      img: {
        src: this.img.src,
        w: this.img.width,
        h: this.img.height
      },
      rects: adjustedRects,
    });

    let blob = new Blob([json], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    /* open url in new tab */
    let a = document.createElement('a');
    a.href = url;
    a.download = "rects.json";
    a.click();
    a.remove();
  }

  DrawImage(ctx) {

    let cs_width = this.canvas.width;
    let cs_height = this.canvas.height;

    this.center.x = cs_width / 2 - (this.img.width * this.zoom) / 2;
    this.center.y = cs_height / 2 - (this.img.height * this.zoom) / 2;

    let mw = this.img.width / ScaleZoom;
    let mh = this.img.height / ScaleZoom;

    let w = this.zoom * mw
    let h = this.zoom * mh

    let px = this.position.x + (cs_width / 2) - (w / 2);
    let py = this.position.y + (cs_height / 2) - (h / 2);

    ctx.strokeStyle = "rgba(51, 255, 0, 0.738)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(px, py, w, h);

    ctx.drawImage(this.img,
      px,
      py,
      w,
      h
    );
  }

  DrawPreview(ctx, rect) {
    {
      /*let x = (this.center.x + rect.position.x * this.zoom) - 5;
      let y = (this.center.y + rect.position.y * this.zoom) - 5;
      x = (x + this.position.x);
      y = (y + this.position.y);

      ctx.fillStyle = "rgba(255, 0, 187, 0.5)";
      ctx.fillRect(x, y, 10, 10);*/
    }
    {
      //console.log(rect);
      let scale = 3;
      let initialZoom = 100;

      let rect_Relative_p = this.GetRelativeRect(rect,
        scale,
        initialZoom
      );

      let rect_Relative_a = this.GetRelativeRect(rect,
        1,
        initialZoom
      );

      ctx.fillStyle = "rgba(13, 75, 174, 0.923)";
      ctx.fillRect(
        rect_Relative_p.position.x,
        rect_Relative_p.position.y,
        rect_Relative_p.size.x,
        rect_Relative_p.size.y
      );


      const ratio = rect.size.x / rect.size.y;

      //console.log("ratio :" + ratio);

      let preview_w = 400;
      let preview_h = preview_w / ratio;

      ctx.fillStyle = "rgba(250, 0, 229, 0.923)";
      ctx.fillRect(0, 500,
        preview_w, preview_h
      );

      this.DrawImageRect(
        ctx,
        this.img,
        {
          x: 0,
          y: 500
        },
        {
          x: preview_w,
          y: preview_h
        }
        ,
        {
          position: {
            x: rect_Relative_a.position.x,
            y: rect_Relative_a.position.y
          },
          size: {
            x: rect_Relative_a.size.x,
            y: rect_Relative_a.size.y
          }
        }
      );

      ctx.drawImage(this.img, 1, 1,
        this.img.width / scale, this.img.height / scale,
      );
    }
  }

  GetRelativeRect(rect, scale = 1, initialZoom = 100) {
    let zoomedImageWidth = (this.img.width * initialZoom) / scale;
    let zoomedImageHeight = (this.img.height * initialZoom) / scale;

    let relativeX =
      ((rect.position.x * initialZoom) / scale) - (zoomedImageWidth / 2)
      + ((this.img.width / scale) / 2);

    let relativeY = ((rect.position.y * initialZoom) / scale) - (zoomedImageHeight / 2)
      + ((this.img.height / scale) / 2);

    let rectw = (rect.size.x * initialZoom) / scale;
    let recth = (rect.size.y * initialZoom) / scale;


    let pivotx = (rect.Pivot.x / (rect.size.x * this.zoom)) / 0.5;
    let pivoty = (rect.Pivot.y / (rect.size.y * this.zoom)) / 0.5;

    return {
      position: {
        x: relativeX,
        y: relativeY
      },
      size: {
        x: rectw,
        y: recth
      },
      pivot: {
        x: pivotx,
        y: pivoty
      }
    }
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

  AutoGenerateRect(
    colonnes,
    lignes,
    margin,
  ) {

    Rect.LastSelection = null;

    let rects = [];

    //console.log(this.center);

    //let x = - (this.img.width / 2)
    //let y = - (this.img.height / 2)

    //let rx = this.center.x + x * this.zoom;
    //let ry = this.center.y + y * this.zoom;

    let cs_width = this.canvas.width;
    let cs_height = this.canvas.height;

    let mw = this.img.width / ScaleZoom;
    let mh = this.img.height / ScaleZoom;

    let w = this.zoom * mw
    let h = this.zoom * mh

    let px = this.position.x + (cs_width / 2) - (w / 2);
    let py = this.position.y + (cs_height / 2) - (h / 2);

    let x = px;
    let y = py;

    let localposition = {
      x: 0,
      y: 0
    }

    localposition.x = x - this.position.x;
    localposition.y = y - this.position.y;

    let x__ = (localposition.x - this.center.x) / this.zoom
    let y__ = (localposition.y - this.center.y) / this.zoom

    let w__ = (w / this.zoom) / colonnes;
    let h__ = (h / this.zoom) / lignes;

    for (let i = 0; i < colonnes; i++) {
      for (let j = 0; j < lignes; j++) {

        let rect = new Rect();

        rect.position.x = x__ + (i * w__);
        rect.position.y = y__ + (j * h__);

        rect.size.x = w__;
        rect.size.y = h__;

        rect.id = i + j * colonnes;

        rects.push(rect);
      }
    }

    this.Rects = rects.sort((a, b) => {
      return a.id - b.id;
    });
  }

  DrawGrid(ctx) {
    /*let space = 50;

    space = (space / 100) * this.zoom;

    let top = ((this.position.y + 5) % space);
    let left = ((this.position.x + 10) % space);

    let width = this.canvas.width;
    let height = this.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#b7b7b7';

    for (let i = top; i < height; i += space) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    for (let i = left; i < width; i += space) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    ctx.restore();
*/
  }

  Draw(ctx) {
    this.DrawGrid(ctx);
    this.DrawImage(ctx);

    for (let i = 0; i < this.Rects.length; i++) {
      if (this.Rects[i] === Rect.LastSelection)
        continue;

      this.Rects[i].Draw(ctx,
        this.center,
        this.position,
        this.zoom
      );
    }

    if (Rect.LastSelection !== null) {
      Rect.LastSelection.Draw(ctx,
        this.center,
        this.position,
        this.zoom
      );
    }

    if (this.lastRect !== undefined)
      this.DrawPreview(ctx, this.lastRect)

    if (this.newRect !== undefined) {
      this.newRect.DrawCreate(ctx);
    }
  }
}

const canvas = document.querySelector('canvas');

if (canvas === null) {
  throw new Error("Canvas not found");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

if (ctx === null) {
  throw new Error("Canvas context not found");
}

const _btnGenerate = document.querySelector('#col-lig-form-gen');
_btnGenerate.addEventListener('submit', (e) => {
  e.preventDefault();

  let colonnes = document.querySelector('#colonnes').value;
  let lignes = document.querySelector('#lignes').value;
  let margin = document.querySelector('#margin').value;

  console.log(colonnes, lignes, margin);
  Instance_View.AutoGenerateRect(
    colonnes,
    lignes,
    margin
  );
});

const _info_form = document.querySelectorAll('#info-form input');
const _RectInfos = document.querySelector('.RectInfos');
_info_form.forEach((input) => {
  input.addEventListener('change', (e) => {
    if (Rect.LastSelection !== null) {

      Rect.LastSelection.name = _RectInfos.querySelector('#name').value;

      Rect.LastSelection.position.x = parseFloat(_RectInfos.querySelector('#x').value);
      Rect.LastSelection.position.y = parseFloat(_RectInfos.querySelector('#y').value);

      Rect.LastSelection.size.x = parseFloat(_RectInfos.querySelector('#w').value);
      Rect.LastSelection.size.y = parseFloat(_RectInfos.querySelector('#h').value);

      Rect.LastSelection.Pivot.x = parseFloat(_RectInfos.querySelector('#px').value);
      Rect.LastSelection.Pivot.y = parseFloat(_RectInfos.querySelector('#py').value);

    }
  })
});

const _btnOpenFile = document.querySelector('#OpenFile');
_btnOpenFile.addEventListener('click', () => OpenFile());

const _btnSaveFile = document.querySelector('#SaveFile');
_btnSaveFile.addEventListener('click', () => SaveFile());

let Instance_View = undefined;
Instance_View = new View(canvas);

function OpenFile() {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = e => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = readerEvent => {
      let content = readerEvent.target.result;
      Instance_View = new View(canvas, content);
    }
  }
  input.click();
}

function SaveFile() {
  if (Instance_View !== undefined) {
    Instance_View.SaveFile();
  }
}

function draw() {
  requestAnimationFrame(draw);

  if (Rect.LastSelection !== null) {
    //delete rect
    if (Instance_View.Inputs["Delete"] === true) {
      Instance_View.Rects = Instance_View.Rects.filter((rect) => {
        return rect !== Rect.LastSelection;
      });

      //recalculate id
      Instance_View.Rects.forEach((rect, index) => {
        rect.id = index + 1;
      });

      Rect.LastSelection = null;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (Instance_View !== undefined) {
    Instance_View.Draw(ctx);
  }
}

requestAnimationFrame(draw);


window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
