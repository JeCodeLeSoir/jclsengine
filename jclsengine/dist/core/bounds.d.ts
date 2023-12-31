import Vector2 from "./vector2.js";
export default class Bounds {
    center: Vector2;
    size: Vector2;
    min: Vector2;
    max: Vector2;
    constructor(center: Vector2, size: Vector2);
    Update(position: Vector2): void;
    DebugDraw(ctx: CanvasRenderingContext2D): void;
    Intersects(bounds: Bounds | Vector2): boolean;
}
