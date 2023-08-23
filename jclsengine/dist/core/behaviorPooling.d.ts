import Behavior from "./behavior.js";
export declare class BehaviorPoolingObject {
    keyName: string;
    behavior: Behavior;
    isFree: boolean;
    constructor(keyName: string, behavior: Behavior);
}
export default class BehaviorPooling {
    private static _instance;
    private _pooling;
    private _poolingCallback;
    static get Instance(): BehaviorPooling;
    Create(keyName: string, callback: () => Behavior, count?: number): void;
    Get(keyName: string): Behavior;
    Free(behavior: Behavior): void;
}
