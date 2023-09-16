import Vector2 from "./vector2.js";
export declare enum EInput {
    forward = 0,
    backward = 1,
    left = 2,
    right = 3,
    space = 4,
    shift = 5
}
export declare enum ECursorLock {
    none = 0,
    locked = 1,
    confine = 2
}
export default class Input {
    private static _instance;
    inputs: boolean[];
    private _mouse;
    private _mouse_delta;
    private _mouse_wheel;
    private _mouse_buttons;
    static get Instance(): Input;
    private static _cursorLock;
    static LockCursor(lock: ECursorLock): void;
    static GetButton(button: number): boolean;
    static GetMouseCoord(): Vector2;
    static GetMouseDelta(): Vector2;
    static GetMouseWheel(): number;
    static GetInput(input: EInput): boolean;
    static GetAxis(positive: EInput, negative: EInput): number;
    constructor();
    private _onMouseWheel;
    private _onPointerDown;
    private _onPointerUp;
    private _onMouseMove;
    private _onPointerMove;
    private _onContextMenu;
    private _onKeyUp;
    private _onKeyDown;
    Update(deltaTime: number): void;
}
