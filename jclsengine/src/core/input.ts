import Vector2 from "./vector2.js";

export enum EInput {
  forward,
  backward,
  left,
  right,
  space,
  shift
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

  static GetButton(button: number): boolean {
    return this.Instance._mouse_buttons[button];
  }

  static GetMouseCoord(): Vector2 {
    return this.Instance._mouse;
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

  constructor() {

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);

    document.addEventListener('contextmenu', (e) => this._onContextMenu(e));
    document.addEventListener('pointermove', (e) => this._onPointerMove(e));

    document.addEventListener('pointerup', (e) => this._onPointerUp(e));
    document.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    document.addEventListener('wheel', (e) => this._onMouseWheel(e), { passive: false });

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
      this._mouse = new Vector2(e.clientX, e.clientY);
    }
  }

  private _onContextMenu(e: MouseEvent): any {
    e.preventDefault();
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