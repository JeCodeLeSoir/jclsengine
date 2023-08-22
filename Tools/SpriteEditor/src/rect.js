import Vector2 from './vector2.js';
const handleSize = 10;
export default class Rect {

  constructor() {
    this.IsResize = false;
    this.IsSelect = false;
    this.Start = new Vector2();
    this.End = new Vector2();
    this.position = new Vector2();
    this.size = new Vector2();
  }

  CheckSelection(mouse_x, mouse_y, center, position, zoom) {
    this.IsSelect = false;

    let rx = center.x + this.position.x * zoom;
    let ry = center.y + this.position.y * zoom;
    let rw = this.size.x * zoom;
    let rh = this.size.y * zoom;

    if (mouse_x > rx + position.x
      && mouse_x < rx + position.x + rw
      && mouse_y > ry + position.y
      && mouse_y < ry + position.y + rh
    ) {
      this.IsSelect = true;
    }
  }

  MoveSelection(
    movement,
    center,
    zoom,
    width_img,
    height_img
  ) {
    if (this.IsSelect === true) {
      let rx = center.x + this.position.x * zoom;
      let ry = center.y + this.position.y * zoom;
      let rw = this.size.x * zoom;
      let rh = this.size.y * zoom;

      this.position.x += movement.x / zoom;
      this.position.y += movement.y / zoom;

      this.position.x = Math.max(0, this.position.x);
      this.position.y = Math.max(0, this.position.y);

      this.position.x = Math.min(width_img - this.size.x, this.position.x);
      this.position.y = Math.min(height_img - this.size.y, this.position.y);

      //

    }
  }

  Create(center, position, zoom) {
    let localposition = { x: 0, y: 0 };

    localposition.x = this.Start.x - position.x;
    localposition.y = this.Start.y - position.y;

    this.position = {
      x: (localposition.x - center.x) / zoom,
      y: (localposition.y - center.y) / zoom
    };

    this.size = {
      x: ((this.End.x - this.Start.x) / zoom),
      y: ((this.End.y - this.Start.y) / zoom)
    };
  }

  CheckSelectionResize(x, y, position) {
    let rx = centerX + this.position.x * zoom;
    let ry = centerY + this.position.y * zoom;
    let rw = this.size.x * zoom;
    let rh = this.size.y * zoom;

    corners = [
      { x: rx, y: ry },
      { x: rx + rw, y: ry },
      { x: rx + rw, y: ry + rh },
      { x: rx, y: ry + rh },
    ];

    for (let corner of corners) {
      if (
        x > corner.x + position.x - handleSize / 2 &&
        x < corner.x + position.x + handleSize / 2 &&
        y > corner.y + position.y - handleSize / 2 &&
        y < corner.y + position.y + handleSize / 2
      ) {
        this.IsResize = true;

        /*
          resizingStart = { x: e.clientX, y: e.clientY };
          initialPosition = { x: rect.position.x, y: rect.position.y };
          initialSize = { w: rect.size.w, h: rect.size.h };
        */
      }
    }
  }

  DrawCreate(ctx) {
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.Start.x,
      this.Start.y,
      (this.End.x - this.Start.x),
      (this.End.y - this.Start.y)
    );
  }

  Draw(ctx, center, position, zoom) {
    this.DrawRect(ctx, center, position, zoom);
    //DrawResizeHandles(ctx, x, y, w, h);
  }

  DrawRect(ctx, center, position, zoom) {
    let rx = center.x + this.position.x * zoom;
    let ry = center.y + this.position.y * zoom;
    let rw = this.size.x * zoom;
    let rh = this.size.y * zoom;

    if (this.IsSelect === true)
      ctx.strokeStyle = "#0000ff";
    else
      ctx.strokeStyle = "#ff0000";

    ctx.lineWidth = 2;
    ctx.strokeRect(
      rx + position.x,
      ry + position.y,
      rw,
      rh
    );
  }

  DrawResizeHandles(ctx, x, y, w, h) {
    const corners = [
      { x: x, y: y },
      { x: x + w, y: y },
      { x: x + w, y: y + h },
      { x: x, y: y + h },
    ];
    for (let corner of corners) {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(
        corner.x - handleSize / 2,
        corner.y - handleSize / 2,
        handleSize, handleSize
      );
    }
  }

  Clone() {
    let rect = new Rect();

    rect.IsResize = this.IsResize;
    rect.IsSelect = this.IsSelect;
    rect.Start = this.Start;
    rect.End = this.End;
    rect.position = this.position;
    rect.size = this.size;

    return rect;
  }
}