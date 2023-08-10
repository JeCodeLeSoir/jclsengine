import Vector2 from "./vector2.js";
export default class Transform {
    position = new Vector2();
    rotation = 0;
    scale = Vector2.one;
    constructor() {
    }
}
