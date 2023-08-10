import Vector2 from "./vector2.js";

export default class Transform {
  position: Vector2 = new Vector2();
  rotation: number = 0;
  scale: Vector2 = Vector2.one;

  constructor() {

  }
}