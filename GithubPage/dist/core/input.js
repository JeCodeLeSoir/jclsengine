import { Behavior_Instance } from "../jclsEngine.js";
import { PointerLock } from "./pointerLock.js";
import Vector2 from "./vector2.js";
export var EInput;
(function (EInput) {
    EInput[EInput["forward"] = 0] = "forward";
    EInput[EInput["backward"] = 1] = "backward";
    EInput[EInput["left"] = 2] = "left";
    EInput[EInput["right"] = 3] = "right";
    EInput[EInput["space"] = 4] = "space";
    EInput[EInput["shift"] = 5] = "shift";
})(EInput || (EInput = {}));
export var ECursorLock;
(function (ECursorLock) {
    ECursorLock[ECursorLock["none"] = 0] = "none";
    ECursorLock[ECursorLock["locked"] = 1] = "locked";
    ECursorLock[ECursorLock["confine"] = 2] = "confine";
})(ECursorLock || (ECursorLock = {}));
export default class Input {
    static _instance;
    inputs = [];
    _mouse = new Vector2(0, 0);
    _mouse_delta = new Vector2(0, 0);
    _mouse_wheel = 0;
    _mouse_buttons = [];
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    static _cursorLock = ECursorLock.none;
    static LockCursor(lock) {
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
                });
                break;
            case ECursorLock.confine:
                break;
        }
    }
    static GetButton(button) {
        return this.Instance._mouse_buttons[button];
    }
    static GetMouseCoord() {
        return this.Instance._mouse.Clone();
    }
    static GetMouseDelta() {
        return this.Instance._mouse_delta;
    }
    static GetMouseWheel() {
        return this.Instance._mouse_wheel;
    }
    static GetInput(input) {
        return this.Instance.inputs[input];
    }
    static GetAxis(positive, negative) {
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
        });
    }
    _onMouseWheel(e) {
        this._mouse_wheel = e.deltaY;
    }
    _onPointerDown(e) {
        this._mouse_buttons[e.button] = true;
    }
    _onPointerUp(e) {
        this._mouse_buttons[e.button] = false;
    }
    _onMouseMove(e) {
    }
    _onPointerMove(e) {
        {
            let x = e.movementX;
            let y = e.movementY;
            //clamp -1 to 1
            x = Math.max(-1, Math.min(1, x));
            y = Math.max(-1, Math.min(1, y));
            this._mouse_delta = new Vector2(x, y);
        }
        {
            const target = Behavior_Instance.canvas;
            const rect = target.getBoundingClientRect();
            const scaleX = target.width / rect.width;
            const scaleY = target.height / rect.height;
            if (Input._cursorLock === ECursorLock.locked) {
                let x = (e.movementX * scaleX);
                let y = (e.movementY * scaleY);
                this._mouse.AddNR(new Vector2(x, y));
            }
            else {
                let x = (e.clientX - rect.left) * scaleX;
                let y = (e.clientY - rect.top) * scaleY;
                x = x - (Behavior_Instance.SCREEN_WIDTH / 2);
                y = y - (Behavior_Instance.SCREEN_HEIGHT / 2);
                this._mouse = new Vector2(x, y);
            }
        }
    }
    _onContextMenu(e) {
        //e.preventDefault();
    }
    _onKeyUp(e) {
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
    _onKeyDown(e) {
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
    Update(deltaTime) {
        this._mouse_delta = new Vector2(0, 0);
        this._mouse_wheel = 0;
    }
}
