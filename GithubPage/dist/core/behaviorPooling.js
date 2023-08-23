import Behavior from "./behavior.js";
export class BehaviorPoolingObject {
    keyName = "";
    behavior;
    isFree = true;
    constructor(keyName, behavior) {
        this.keyName = keyName;
        this.behavior = behavior;
    }
}
export default class BehaviorPooling {
    static _instance;
    _pooling = [];
    _poolingCallback = [];
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    Create(keyName, callback, count = 1) {
        console.log("Create pooling: " + keyName + " - " + count);
        for (let i = 0; i < count; i++) {
            const behavior = callback();
            behavior.IsEnabled = false;
            this._pooling.push(new BehaviorPoolingObject(keyName, behavior));
            Behavior.Instantiate(behavior);
        }
        this._poolingCallback[keyName] = callback;
    }
    Get(keyName) {
        for (let p = 0; p < this._pooling.length; p++) {
            if (this._pooling[p].keyName === keyName) {
                if (this._pooling[p].isFree === true) {
                    this._pooling[p].isFree = false;
                    this._pooling[p].behavior.IsEnabled = true;
                    return this._pooling[p].behavior;
                }
            }
        }
        let behavior = this._poolingCallback[keyName]();
        let bpo = new BehaviorPoolingObject(keyName, behavior);
        bpo.isFree = false;
        this._pooling.push(bpo);
        behavior.IsEnabled = true;
        Behavior.Instantiate(behavior);
        console.log("Create pooling: " + keyName + " - " + 1);
        return behavior;
    }
    Free(behavior) {
        for (let p = 0; p < this._pooling.length; p++) {
            if (this._pooling[p].behavior === behavior) {
                this._pooling[p].isFree = true;
                behavior.IsEnabled = false;
                return;
            }
        }
    }
}
