import { Behavior_Instance } from "../jclsEngine.js";
import Physics, { PhysicsCollider2d } from "../physics/physics.js";
import Vector2 from "./vector2.js";
export default class Behavior {
    _isLoaded = false;
    _isDestroyed = false;
    _collisionEnter = false;
    _parent = null;
    Tag = "default";
    DisplayOrder = 0;
    IsPhysics = false;
    //protected boundingBox: Bounds | null = null;
    /*GetBoundingBox() {
     return this.boundingBox;
   }*/
    physicsCollider = null;
    shap = null;
    SetParent(parent) {
        this._parent = parent;
        this.localPosition =
            this.position.Subtract(this._parent.position);
    }
    GetParent() {
        return this._parent;
    }
    localPosition = new Vector2();
    position = new Vector2();
    rotation = 90;
    //collider: PhysicsCollider2d;
    SetPosition(position) {
        this.position = position;
    }
    GetIsPhysics() {
        return this.IsPhysics;
    }
    GetTag() {
        return this.Tag;
    }
    SetTag(tag) {
        this.Tag = tag;
    }
    SetCollisionEnter(Enter) {
        this._collisionEnter = Enter;
    }
    GetCollisionEnter() {
        return this._collisionEnter;
    }
    GetDisplayOrder() {
        return this.DisplayOrder;
    }
    Load() { }
    Init(ctx) {
    }
    InitPhysics() {
        let physics = Physics.Instance;
        if (this.GetIsPhysics()) {
            if (this.physicsCollider === null)
                this.physicsCollider = new PhysicsCollider2d();
            this.physicsCollider.behavior = this;
            this.physicsCollider.shap = this.shap;
            physics.AddCollider(this.physicsCollider);
        }
    }
    ApplyTransform() {
        if (this._parent !== null) {
            this.position = this.localPosition.Clone().Add(this._parent.position);
        }
    }
    Update(deltaTime) { }
    Draw(ctx, deltaTime) {
    }
    Destroy() {
        this._isDestroyed = true;
        if (this.GetIsPhysics()) {
            let physics = Physics.Instance;
            physics.RemoveCollider(this.physicsCollider);
        }
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
    Instantiate(behavior, behavior_parent = null) {
        Behavior_Instance.behaviors.push(behavior);
        behavior.Load();
        if (behavior_parent !== null) {
            behavior.SetParent(behavior_parent);
        }
        return behavior;
    }
    setIsLoaded(isLoaded) {
        this._isLoaded = isLoaded;
    }
}
