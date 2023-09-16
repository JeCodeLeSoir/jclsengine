import Vector2 from './vector2.js';
const handleSize = 10;
export default class Rect {

  static LastSelection = null;

  constructor() {
    this.id = 0;
    this.IsDrag = false;
    this.IsResize = false;

    this.IdCorner = -1;

    this.IsMovePivot = false;
    this.Pivot = new Vector2();


    this.Start = new Vector2();
    this.End = new Vector2();
    this.position = new Vector2();
    this.size = new Vector2();

    this.resizingStart = { x: 0, y: 0 };
    this.initialPosition = { x: this.position.x, y: this.position.y };
    this.initialSize = { x: this.size.x, y: this.size.y };
  }

  Reset() {
    this.IsDrag = false;
    this.IsResize = false;
    this.IsMovePivot = false;
  }

  ReCalculeRect() {
    if (this.size.x < 0) {
      this.position.x += this.size.x;
      this.size.x = Math.abs(this.size.x);
    }

    if (this.size.y < 0) {
      this.position.y += this.size.y;
      this.size.y = Math.abs(this.size.y);
    }
  }

  CheckSelection(mouse_x, mouse_y, clientX, clientY, center, position, zoom) {
    if (!this.CheckSelectionResize(mouse_x, mouse_y, clientX, clientY, center, position, zoom)) {
      const dataRect = this.DataRect(center, zoom);
      if (mouse_x > dataRect.rx + position.x
        && mouse_x < dataRect.rx + position.x + dataRect.rw
        && mouse_y > dataRect.ry + position.y
        && mouse_y < dataRect.ry + position.y + dataRect.rh
      ) {
        Rect.LastSelection = this;
        this.IsDrag = true;
      }
    }
  }

  MovePivot(movement, center, zoom) {
    if (Rect.LastSelection === this && this.IsMovePivot === true) {

      console.log("MovePivot");

      const size_x = this.size.x * zoom;
      const size_y = this.size.y * zoom;

      if (this.Pivot.x + movement.x < -size_x / 2) {
        this.Pivot.x = -size_x / 2;
      }

      if (this.Pivot.x + movement.x > size_x / 2) {
        this.Pivot.x = size_x / 2;
      }

      if (this.Pivot.y + movement.y < -size_y / 2) {
        this.Pivot.y = -size_y / 2;
      }

      if (this.Pivot.y + movement.y > size_y / 2) {
        this.Pivot.y = size_y / 2;
      }

      this.Pivot.x += movement.x;
      this.Pivot.y += movement.y;

    }
  }

  Resize(client, center, zoom) {
    if (Rect.LastSelection === this && this.IsResize === true) {

      console.log("Resize : " + this.IdCorner);

      const dx = client.x - this.resizingStart.x;
      const dy = client.y - this.resizingStart.y;

      console.log("dx: " + dx);
      console.log("dy: " + dy);

      if (this.IdCorner === 0 || this.IdCorner === 3) {
        this.position.x = (this.initialPosition.x + dx / zoom);
        this.size.x = (this.initialSize.x - dx / zoom);
      }
      else {
        this.size.x = (this.initialSize.x + dx / zoom);
      }

      if (this.IdCorner === 0 || this.IdCorner === 1) {
        this.position.y = (this.initialPosition.y + dy / zoom);
        this.size.y = (this.initialSize.y - dy / zoom);
      }
      else {
        this.size.y = (this.initialSize.y + dy / zoom);
      }

    }
  }

  MoveSelection(
    movement,
    center,
    zoom,
    width_img,
    height_img
  ) {
    if (Rect.LastSelection === this && this.IsDrag === true) {
      this.position.x += movement.x / zoom;
      this.position.y += movement.y / zoom;

      this.position.x = Math.max(0, this.position.x);
      this.position.y = Math.max(0, this.position.y);

      this.position.x = Math.min(width_img - this.size.x, this.position.x);
      this.position.y = Math.min(height_img - this.size.y, this.position.y);

    }
  }

  Create(id, center, position, zoom) {

    this.id = id;

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

    this.Pivot = {
      x: 0,
      y: 0
    };

    this.ReCalculeRect();
  }

  DataRect(center, zoom) {
    return {
      rx: center.x + this.position.x * zoom,
      ry: center.y + this.position.y * zoom,
      rw: this.size.x * zoom,
      rh: this.size.y * zoom,
    };
  }

  CheckSelectionResize(
    mouse_x,
    mouse_y,
    clientX,
    clientY,
    center, position, zoom) {
    const dataRect = this.DataRect(center, zoom);
    const corners = [
      { x: dataRect.rx, y: dataRect.ry, id: 0 }, // top left
      { x: dataRect.rx + dataRect.rw, y: dataRect.ry, id: 1 }, // top right
      { x: dataRect.rx + dataRect.rw, y: dataRect.ry + dataRect.rh, id: 2 }, // bottom right
      { x: dataRect.rx, y: dataRect.ry + dataRect.rh, id: 3 }, // bottom left
      {
        x: (dataRect.rx + dataRect.rw / 2) + this.Pivot.x,
        y: (dataRect.ry + dataRect.rh / 2) + this.Pivot.y,
        //x: (x + w / 2) + this.Pivot.x,
        //y: (y + h / 2) + this.Pivot.y,
        id: 4
      }, // center
    ];

    for (let corner of corners) {
      if (
        mouse_x > corner.x + position.x - (handleSize * 2) / 2 &&
        mouse_x < corner.x + position.x + (handleSize * 2) / 2 &&
        mouse_y > corner.y + position.y - (handleSize * 2) / 2 &&
        mouse_y < corner.y + position.y + (handleSize * 2) / 2
      ) {
        Rect.LastSelection = this;
        this.IdCorner = corner.id;
        if (corner.id === 4) {
          // move pivot
          //console.log("move pivot");
          this.IsMovePivot = true;
        }
        else {
          this.IsResize = true;

          this.resizingStart = { x: clientX, y: clientY };
          this.initialPosition = { x: this.position.x, y: this.position.y };
          this.initialSize = { x: this.size.x, y: this.size.y };

        }
        return true;
      }
    }

    return false;
  }

  DrawCreate(ctx) {
    ctx.save();
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.Start.x,
      this.Start.y,
      (this.End.x - this.Start.x),
      (this.End.y - this.Start.y)
    );
    ctx.restore();
  }

  Draw(ctx, center, position, zoom) {
    this.DrawRect(ctx, center, position, zoom);
    this.DrawResizeHandles(ctx, center, position, zoom);
  }

  DrawRect(ctx, center, position, zoom) {

    const dataRect = this.DataRect(center, zoom);

    ctx.save();


    if (Rect.LastSelection === this)
      ctx.strokeStyle = "#0000ff";
    else
      ctx.strokeStyle = "#ff0000";

    ctx.lineWidth = 2;
    ctx.strokeRect(
      dataRect.rx + position.x,
      dataRect.ry + position.y,
      dataRect.rw,
      dataRect.rh
    );

    //draw text id
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText(
      this.id,
      //center x
      dataRect.rx + position.x + dataRect.rw / 2 - 5,

      dataRect.ry + position.y + 15

    );

    ctx.restore();
  }

  DrawResizeHandles(ctx, center, position, zoom) {

    //console.log("DrawResizeHandles");

    let x = center.x + this.position.x * zoom;
    let y = center.y + this.position.y * zoom;

    x = x + position.x;
    y = y + position.y;

    let w = this.size.x * zoom;
    let h = this.size.y * zoom;


    const corners = [
      { x: x, y: y, id: 0 }, // top left
      { x: x + w, y: y, id: 1 }, // top right
      { x: x + w, y: y + h, id: 2 }, // bottom right
      { x: x, y: y + h, id: 3 }, // bottom left
      {
        x: (x + w / 2) + this.Pivot.x,
        y: (y + h / 2) + this.Pivot.y
        , id: 4
      }, // center
    ];

    for (let corner of corners) {
      if (corner.id === 4) {
        ctx.fillStyle = "#21b039";
        //circle

        ctx.beginPath();
        ctx.arc(
          corner.x,
          corner.y,
          handleSize / 1.5,
          0,
          2 * Math.PI
        );
        ctx.fill();

      }
      else {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(
          corner.x - handleSize / 2,
          corner.y - handleSize / 2,
          handleSize, handleSize
        );
      }
    }

  }

  Clone() {
    let rect = new Rect();

    rect.id = this.id;
    rect.IsResize = this.IsResize;
    rect.Start = this.Start;
    rect.End = this.End;
    rect.position = this.position;
    rect.size = this.size;

    return rect;
  }
}