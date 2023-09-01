import { Behavior_Instance } from "../jclsEngine.js";
import Physics, { ColliderShap, PhysicsCollider2d } from "../physics/physics.js";
import Bounds from "./bounds.js";
import Tags from "./tags.js";
import Vector2 from "./vector2.js";

export default abstract class Behavior {

  private _IsEnabled: boolean = true;

  private _isLoaded: boolean = false;
  private _isDestroyed: boolean = false;
  private _collisionEnter: boolean = false;
  private _parent: Behavior | null = null;

  protected Tag: Tags = "default";
  protected DisplayOrder: number = 0;
  protected IsPhysics: boolean = false;

  //protected boundingBox: Bounds | null = null;
  /*GetBoundingBox() {
   return this.boundingBox;
 }*/

  public physicsCollider: PhysicsCollider2d | null = null;
  public shap: ColliderShap | null = null;

  set IsEnabled(isEnabled: boolean) {
    this._IsEnabled = isEnabled;
  }

  get IsEnabled() {
    return this._IsEnabled;
  }

  public GetParent() {
    return this._parent;
  }

  public get Forward(): Vector2 {
    return new Vector2(
      Math.cos(this.rotation * Math.PI / 180),
      Math.sin(this.rotation * Math.PI / 180)
    );
  }

  public get Right(): Vector2 {
    return new Vector2(
      Math.cos((this.rotation + 90) * Math.PI / 180),
      Math.sin((this.rotation + 90) * Math.PI / 180)
    );
  }

  localPosition: Vector2 = new Vector2();
  position: Vector2 = new Vector2();
  localRotation: number = 0;
  rotation: number = 0;
  //collider: PhysicsCollider2d;

  SetPosition(position: Vector2) {
    this.position = position;
  }

  GetIsPhysics() {
    return this.IsPhysics;
  }

  GetTag(): Tags {
    return this.Tag;
  }

  SetTag(tag: Tags) {
    this.Tag = tag;
  }

  SetCollisionEnter(Enter: boolean) {
    this._collisionEnter = Enter;
  }

  GetCollisionEnter() {
    return this._collisionEnter;
  }

  GetDisplayOrder() {
    return this.DisplayOrder;
  }

  Load() { }

  Init(ctx: CanvasRenderingContext2D) {

  }

  Copy(): Behavior {
    let x = JSON.parse(
      JSON.stringify(this)
    );
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

  public TransformToLocal(parent: Behavior, position: Vector2): Vector2 {
    let localPosition = position.Subtract(parent.position);

    let angle = parent.rotation * Math.PI / 180;

    let localPositionAndRotation = localPosition.RotateAround(-angle, parent.position);

    return localPositionAndRotation;
  }

  public TransformToGlobal(parent: Behavior, position: Vector2): Vector2 {

    let globalPosition = position.Add(parent.position);

    let angle = parent.rotation * Math.PI / 180;; //90 * Math.PI / 180;

    let globalPositionAndRotation = globalPosition.RotateAround(angle, parent.position);

    return globalPositionAndRotation;
  }

  public SetParent(parent: Behavior) {
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

  Update(deltaTime: number) { }
  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) { }

  Destroy() {
    this._isDestroyed = true;

    if (this.GetIsPhysics()) {
      let physics = Physics.Instance;
      physics.RemoveCollider(this.physicsCollider!);
    }

    this.OnDestroy();
  }

  abstract OnDestroy(): void;

  OnCollisionEnter(other: Behavior): void { }
  OnCollisionExit(other: Behavior): void { }

  GetIsDestroyed() {
    return this._isDestroyed;
  }

  GetIsLoaded() {
    return this._isLoaded;
  }

  static Instantiate<T extends Behavior>(behavior: T,
    behavior_parent: Behavior | null = null,
    notLoad: boolean = false
  ): T {
    Behavior_Instance.behaviors.push(behavior);

    if (!notLoad)
      behavior.Load();

    if (behavior_parent !== null) {
      behavior.SetParent(behavior_parent);
    }

    return behavior;
  }

  Instantiate<T extends Behavior>(behavior: T,
    behavior_parent: Behavior | null = null,
    notLoad: boolean = false
  ): T {
    return Behavior.Instantiate(behavior, behavior_parent, notLoad);
  }

  setIsLoaded(isLoaded: boolean) {
    this._isLoaded = isLoaded;
  }

}