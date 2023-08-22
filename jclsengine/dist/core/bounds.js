import Vector2 from "./vector2.js";
export default class Bounds {
    center;
    size;
    min;
    max;
    constructor(center, size) {
        this.center = center;
        this.size = size;
        this.min = new Vector2();
        this.max = new Vector2();
        this.min.x = center.x - size.x / 2;
        this.min.y = center.y - size.y / 2;
        this.max.x = center.x + size.x / 2;
        this.max.y = center.y + size.y / 2;
    }
    /*Update(behavior: Behavior) {
      this.center = behavior.position;
  
      this.min.x = this.center.x - this.size.x / 2;
      this.min.y = this.center.y - this.size.y / 2;
  
      this.max.x = this.center.x + this.size.x / 2;
      this.max.y = this.center.y + this.size.y / 2;
    }*/
    Update(position) {
        this.center = position;
        this.min.x = this.center.x - this.size.x / 2;
        this.min.y = this.center.y - this.size.y / 2;
        this.max.x = this.center.x + this.size.x / 2;
        this.max.y = this.center.y + this.size.y / 2;
    }
    DebugDraw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(this.min.x, this.min.y, this.size.x, this.size.y);
        ctx.stroke();
    }
    Intersects(bounds) {
        if (bounds instanceof Bounds) {
            return this.min.x < bounds.max.x
                && this.max.x > bounds.min.x
                && this.min.y < bounds.max.y
                && this.max.y > bounds.min.y;
        }
        else if (bounds instanceof Vector2) {
            return this.min.x < bounds.x
                && this.max.x > bounds.x
                && this.min.y < bounds.y
                && this.max.y > bounds.y;
        }
        return false;
    }
    SqrDistance(point) {
        let dx = Math.max(this.min.x - point.x, 0, point.x - this.max.x);
        let dy = Math.max(this.min.y - point.y, 0, point.y - this.max.y);
        return dx * dx + dy * dy;
    }
}
