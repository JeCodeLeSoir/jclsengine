import Vector2 from "./vector2.js";
export default class Camera {
    private static instance;
    static get mainCamera(): Camera;
    position: Vector2;
    get size(): Vector2;
    rotation: number;
    ScreenToWorldPoint(mouse: Vector2): Vector2;
}
