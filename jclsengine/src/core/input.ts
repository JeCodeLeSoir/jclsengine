import { Behavior_Instance } from "../jclsEngine.js";
import { PointerLock } from "./pointerLock.js";
import Vector2 from "./vector2.js";

export enum EInput {
  forward,
  backward,
  left,
  right,
  space,
  shift
}

export enum ECursorLock {
  none,
  locked,
  confine
}

export default class Input {
  private static _instance: Input;

  inputs: boolean[] = [];

  private _mouse: Vector2 = new Vector2(0, 0);
  private _mouse_delta: Vector2 = new Vector2(0, 0);
  private _mouse_wheel: number = 0;
  private _mouse_buttons: boolean[] = [];

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private static _cursorLock: ECursorLock = ECursorLock.none;

  static LockCursor(lock: ECursorLock) {

    if (this._cursorLock === lock)
      return;

    Input._cursorLock = lock;

    switch (lock) {
      case ECursorLock.none:
        document.exitPointerLock();
        break;
      case ECursorLock.locked:
        //unadjustedMovement: true

        PointerLock.requestPointerLock(Behavior_Instance.canvas, {
          unadjustedMovement: true,
        })

        break;
      case ECursorLock.confine:
        break;
    }
  }

  static GetButton(button: number): boolean {
    return this.Instance._mouse_buttons[button];
  }

  static GetMouseCoord(): Vector2 {
    return this.Instance._mouse.Clone();
  }

  static GetMouseDelta(): Vector2 {
    return this.Instance._mouse_delta;
  }

  static GetMouseWheel(): number {
    return this.Instance._mouse_wheel;
  }

  static GetInput(input: EInput): boolean {
    return this.Instance.inputs[input];
  }


  static GetAxis(positive: EInput, negative: EInput): number {
    let axis = 0;

    if (this.Instance.inputs[positive]) {
      axis -= 1;
    }
    if (this.Instance.inputs[negative]) {
      axis += 1;
    }

    return axis;
  }

  constructor() {

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);

    document.addEventListener('contextmenu', (e) => this._onContextMenu(e));

    // Move
    document.addEventListener('mousemove', (e) => this._onMouseMove(e));
    document.addEventListener('pointermove', (e) => this._onPointerMove(e));

    document.addEventListener('pointerup', (e) => this._onPointerUp(e));
    document.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    document.addEventListener('wheel', (e) => this._onMouseWheel(e), { passive: false });

    //event pointer unlock
    document.addEventListener('pointerlockchange', (e) => {
      console.log("pointerlockchange");
      console.log(e);

      //is locked ?
      //console.log(document.pointerLockElement);
      //console.log((Behavior_Instance.canvas as any).pointerLockElement);

      if (document.pointerLockElement === null
        || document.pointerLockElement === undefined) {
        if (Input._cursorLock === ECursorLock.locked) {
          Input._cursorLock = ECursorLock.none;
          console.log("unlock");
        }
      }

    }, false);

    document.addEventListener('pointerlockerror', (e) => {
      console.error(e);
    })

  }

  private _onMouseWheel(e: WheelEvent): any {
    this._mouse_wheel = e.deltaY;
  }

  private _onPointerDown(e: PointerEvent): any {
    this._mouse_buttons[e.button] = true;
  }

  private _onPointerUp(e: PointerEvent): any {
    this._mouse_buttons[e.button] = false;
  }

  private _onMouseMove(e: MouseEvent) {

  }

  private _onPointerMove(e: PointerEvent): any {
    {
      let x = e.movementX;
      let y = e.movementY;

      //clamp -1 to 1
      x = Math.max(-1, Math.min(1, x));
      y = Math.max(-1, Math.min(1, y));

      this._mouse_delta = new Vector2(x, y);
    }

    {
      const target = Behavior_Instance.canvas as HTMLCanvasElement;
      const rect = target.getBoundingClientRect();

      const scaleX = target.width / rect.width;
      const scaleY = target.height / rect.height;

      if (Input._cursorLock === ECursorLock.locked) {
        let x = (e.movementX * scaleX);
        let y = (e.movementY * scaleY);
        this._mouse.AddNR(new Vector2(x, y));
      }
      else {
        let x = (e.clientX - rect.left) * scaleX
        let y = (e.clientY - rect.top) * scaleY

        x = x - (Behavior_Instance.SCREEN_WIDTH / 2);
        y = y - (Behavior_Instance.SCREEN_HEIGHT / 2);

        this._mouse = new Vector2(x, y);
      }

    }
  }

  private _onContextMenu(e: MouseEvent): any {
    //e.preventDefault();
  }

  private _onKeyUp(e: KeyboardEvent): any {
    if (e.key === 'ArrowUp' || e.key === 'z') {
      this.inputs[EInput.forward] = false;
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
      this.inputs[EInput.backward] = false;
    }
    if (e.key === 'ArrowLeft' || e.key === 'q') {
      this.inputs[EInput.left] = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
      this.inputs[EInput.right] = false;
    }
    if (e.key === ' ') {
      this.inputs[EInput.space] = false;
    }
  }

  private _onKeyDown(e: KeyboardEvent): any {
    if (e.key === 'ArrowUp' || e.key === 'z') {
      this.inputs[EInput.forward] = true;
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
      this.inputs[EInput.backward] = true;
    }
    if (e.key === 'ArrowLeft' || e.key === 'q') {
      this.inputs[EInput.left] = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
      this.inputs[EInput.right] = true;
    }
    if (e.key === ' ') {
      this.inputs[EInput.space] = true;
    }
  }

  Update(deltaTime: number) {
    this._mouse_delta = new Vector2(0, 0);
    this._mouse_wheel = 0;
  }

}