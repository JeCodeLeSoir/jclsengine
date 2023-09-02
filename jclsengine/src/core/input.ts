import { Behavior_Instance } from "../jclsEngine.js";
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
        Behavior_Instance.canvas?.requestPointerLock();
        break;
      case ECursorLock.confine:
        break;
    }
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
      if (document.pointerLockElement === null) {
        Input._cursorLock = ECursorLock.none;
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

  test_d = 0;
  private _mouse_last: Vector2 = new Vector2(0, 0);


  private _onMouseMove(e: MouseEvent) {
    if (Input._cursorLock === ECursorLock.locked) {

    }
  }

  private _onPointerMove(e: PointerEvent): any {


    const scaleX = 0.4;
    const scaleY = 0.4;

    let x = (e.movementX * scaleX);
    let y = (e.movementY * scaleY);


    if (x != 0 || y != 0)
      this._mouse.AddNR(new Vector2(x, y));

    if (this._mouse_last != this._mouse) {
      let d = this._mouse_last.Distance(this._mouse);
      if (d > this.test_d) {
        this.test_d = d;
        console.log(d);

        console.log(this._mouse_last, this._mouse);
      }
    }

    {
      // let x = e.movementX;
      // let y = e.movementY;

      //clamp -1 to 1
      //  x = Math.max(-1, Math.min(1, x));
      //  y = Math.max(-1, Math.min(1, y));

      // this._mouse_delta = new Vector2(x, y);
    }

    {
      /*if (e.target instanceof HTMLCanvasElement) {
        let target = e.target as HTMLCanvasElement;
        let rect = target.getBoundingClientRect();*/

      const target = Behavior_Instance.canvas as HTMLCanvasElement;
      const rect = target.getBoundingClientRect();

      const scaleX = target.width / rect.width;   // relationship bitmap vs. element for x
      const scaleY = target.height / rect.height;

      //console.log(scaleX, scaleY);

      // relationship bitmap vs. element for y

      //console.log(e);

      if (Input._cursorLock === ECursorLock.locked) {
        /*
                let x = (e.movementX * scaleX);
                let y = (e.movementY * scaleY);
  
                //console.log("locked");
  
                console.log(x, y);
  
                this._mouse.AddNR(new Vector2(x, y));
        */
      }
      else {

        //console.log("not locked");

        //let x = (e.clientX - rect.left) * scaleX
        //let y = (e.clientY - rect.top) * scaleY
        //this._mouse = new Vector2(x, y);
      }
      //}
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