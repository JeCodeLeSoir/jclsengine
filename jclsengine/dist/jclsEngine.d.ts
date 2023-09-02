import Behavior from "./core/behavior.js";
export declare class Behavior_Instance {
    static canvas: HTMLCanvasElement | null;
    static behaviors: Behavior[];
    static SCREEN_HEIGHT: number;
    static SCREEN_WIDTH: number;
}
export default class JCLSEngine {
    On(event: string, callback: () => void): void;
    ReSize(ratio: any, canvas: any): void;
    constructor(_callback: () => Behavior[]);
}
