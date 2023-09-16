import { Behavior_Instance } from "../jclsEngine.js";
import Vector2 from "./vector2.js";

export default class Camera {

  /* instance */
  private static instance: Camera | null = null;

  static get mainCamera(): Camera {
    if (Camera.instance == null) {
      Camera.instance = new Camera();
    }
    return Camera.instance;
  }

  position: Vector2 = new Vector2(150, 150);
  get size(): Vector2 {
    return new Vector2(
      Behavior_Instance.SCREEN_WIDTH,
      Behavior_Instance.SCREEN_HEIGHT
    );
  }
  rotation: number = 0;

  ScreenToWorldPoint(mouse: Vector2): Vector2 {

    return new Vector2(
      mouse.x + this.position.x,
      mouse.y + this.position.y
    );
  }


}