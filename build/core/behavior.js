import { Behavior_Instance } from "../app.js";
export default class Behavior {
    _isLoaded = false;
    _isDestroyed = false;
    _collisionEnter = false;
    Tag = "default";
    DisplayOrder = 0;
    IsPhysics = false;
    boundingBox = null;
    x = 0;
    y = 0;
    SetPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    GetIsPhysics() {
        return this.IsPhysics;
    }
    GetTag() {
        return this.Tag;
    }
    SetCollisionEnter(Enter) {
        this._collisionEnter = Enter;
    }
    GetCollisionEnter() {
        return this._collisionEnter;
    }
    GetBoundingBox() {
        return this.boundingBox;
    }
    GetDisplayOrder() {
        return this.DisplayOrder;
    }
    Load() { }
    Init(ctx) { }
    Update(deltaTime) { }
    Draw(ctx, deltaTime) { }
    Destroy() {
        this._isDestroyed = true;
        this.OnDestroy();
    }
    OnCollisionEnter(other) { }
    OnCollisionExit(other) { }
    GetIsDestroyed() {
        return this._isDestroyed;
    }
    GetIsLoaded() {
        return this._isLoaded;
    }
    Instantiate(behavior) {
        Behavior_Instance.behaviors.push(behavior);
        behavior.Load();
        return behavior;
    }
    setIsLoaded(isLoaded) {
        this._isLoaded = isLoaded;
    }
}
