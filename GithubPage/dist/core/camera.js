import { Behavior_Instance } from "../jclsEngine.js";
import Vector2 from "./vector2.js";
export default class Camera {
    /* instance */
    static instance = null;
    static get mainCamera() {
        if (Camera.instance == null) {
            Camera.instance = new Camera();
        }
        return Camera.instance;
    }
    position = new Vector2(150, 150);
    get size() {
        return new Vector2(Behavior_Instance.SCREEN_WIDTH, Behavior_Instance.SCREEN_HEIGHT);
    }
    rotation = 0;
    ScreenToWorldPoint(mouse) {
        return new Vector2(mouse.x + this.position.x, mouse.y + this.position.y);
    }
}
