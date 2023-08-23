import Behavior from "./behavior.js";

export class BehaviorPoolingObject {
  public keyName: string = "";
  public behavior: Behavior;
  public isFree: boolean = true;

  constructor(keyName: string, behavior: Behavior) {
    this.keyName = keyName;
    this.behavior = behavior;
  }
}

export default class BehaviorPooling {
  private static _instance: BehaviorPooling;

  private _pooling: BehaviorPoolingObject[] = [];
  private _poolingCallback: any[] = [];

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public Create(keyName: string, callback: () => Behavior, count: number = 1) {
    console.log("Create pooling: " + keyName + " - " + count);
    for (let i = 0; i < count; i++) {
      const behavior = callback();
      behavior.IsEnabled = false;
      this._pooling.push(new BehaviorPoolingObject(keyName, behavior));
      Behavior.Instantiate(behavior);
    }
    this._poolingCallback[keyName] = callback;
  }

  public Get(keyName: string): Behavior {

    for (let p = 0; p < this._pooling.length; p++) {
      if (this._pooling[p].keyName === keyName) {
        if (this._pooling[p].isFree === true) {
          this._pooling[p].isFree = false;
          this._pooling[p].behavior.IsEnabled = true;
          return this._pooling[p].behavior;
        }
      }
    }

    let behavior: Behavior = this._poolingCallback[keyName]();
    let bpo = new BehaviorPoolingObject(keyName, behavior);
    bpo.isFree = false;
    this._pooling.push(bpo);
    behavior.IsEnabled = true;
    Behavior.Instantiate(behavior);

    console.log("Create pooling: " + keyName + " - " + 1);

    return behavior;
  }

  public Free(behavior: Behavior) {
    for (let p = 0; p < this._pooling.length; p++) {
      if (this._pooling[p].behavior === behavior) {
        this._pooling[p].isFree = true;
        behavior.IsEnabled = false;
        return;
      }
    }
  }

}