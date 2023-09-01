import { Behavior_Instance } from "../jclsEngine.js";
import Physics, { PhysicsCollider2d } from "../physics/physics.js";
import Vector2 from "./vector2.js";
export default class Behavior {
    _IsEnabled = true;
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
    set IsEnabled(isEnabled) {
        this._IsEnabled = isEnabled;
    }
    get IsEnabled() {
        return this._IsEnabled;
    }
    GetParent() {
        return this._parent;
    }
    get Forward() {
        return new Vector2(Math.cos(this.rotation * Math.PI / 180), Math.sin(this.rotation * Math.PI / 180));
    }
    get Right() {
        return new Vector2(Math.cos((this.rotation + 90) * Math.PI / 180), Math.sin((this.rotation + 90) * Math.PI / 180));
    }
    localPosition = new Vector2();
    position = new Vector2();
    localRotation = 0;
    rotation = 0;
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
    Copy() {
        let x = JSON.parse(JSON.stringify(this));
        return x;
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
    TransformToLocal(parent, position) {
        let localPosition = position.Subtract(parent.position);
        let angle = parent.rotation * Math.PI / 180;
        let localPositionAndRotation = localPosition.RotateAround(-angle, parent.position);
        return localPositionAndRotation;
    }
    TransformToGlobal(parent, position) {
        let globalPosition = position.Add(parent.position);
        let angle = parent.rotation * Math.PI / 180;
        ; //90 * Math.PI / 180;
        let globalPositionAndRotation = globalPosition.RotateAround(angle, parent.position);
        return globalPositionAndRotation;
    }
    SetParent(parent) {
        this._parent = parent;
        this.position.AddNR(parent.position);
        this.localPosition = this.TransformToLocal(parent, this.position);
    }
    ApplyTransform() {
        if (this._parent !== null) {
            this.position = this.TransformToGlobal(this._parent, this.localPosition);
            this.rotation = this._parent.rotation;
        }
    }
    Update(deltaTime) { }
    Draw(ctx, deltaTime) { }
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
    static Instantiate(behavior, behavior_parent = null, notLoad = false) {
        Behavior_Instance.behaviors.push(behavior);
        if (!notLoad)
            behavior.Load();
        if (behavior_parent !== null) {
            behavior.SetParent(behavior_parent);
        }
        return behavior;
    }
    Instantiate(behavior, behavior_parent = null, notLoad = false) {
        return Behavior.Instantiate(behavior, behavior_parent, notLoad);
    }
    setIsLoaded(isLoaded) {
        this._isLoaded = isLoaded;
    }
}
