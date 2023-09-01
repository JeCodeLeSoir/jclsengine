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
    static GetButton(button) {
        return this.Instance._mouse_buttons[button];
    }
    static GetMouseCoord() {
        return this.Instance._mouse;
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
        document.addEventListener('pointermove', (e) => this._onPointerMove(e));
        document.addEventListener('pointerup', (e) => this._onPointerUp(e));
        document.addEventListener('pointerdown', (e) => this._onPointerDown(e));
        document.addEventListener('wheel', (e) => this._onMouseWheel(e), { passive: false });
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
            if (e.target instanceof HTMLCanvasElement) {
                let target = e.target;
                let rect = target.getBoundingClientRect();
                let scaleX = target.width / rect.width; // relationship bitmap vs. element for x
                let scaleY = target.height / rect.height; // relationship bitmap vs. element for y
                let x = (e.clientX - rect.left) * scaleX;
                let y = (e.clientY - rect.top) * scaleY;
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
