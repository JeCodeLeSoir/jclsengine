import { Behavior_Instance } from "../jclsEngine.js";
import Physics, { ColliderShap, PhysicsCollider2d } from "../physics/physics.js";
import Bounds from "./bounds.js";
import Vector2 from "./vector2.js";

export default abstract class Behavior {

  private _isLoaded: boolean = false;
  private _isDestroyed: boolean = false;
  private _collisionEnter: boolean = false;
  private _parent: Behavior | null = null;

  protected Tag: string = "default";
  protected DisplayOrder: number = 0;
  protected IsPhysics: boolean = false;

  //protected boundingBox: Bounds | null = null;
  /*GetBoundingBox() {
   return this.boundingBox;
 }*/

  public physicsCollider: PhysicsCollider2d | null = null;
  public shap: ColliderShap | null = null;

  public SetParent(parent: Behavior) {
    this._parent = parent;
    this.localPosition =
      this.position.Subtract(this._parent.position);
  }

  public GetParent() {
    return this._parent;
  }

  localPosition: Vector2 = new Vector2();
  position: Vector2 = new Vector2();
  rotation: number = 90;
  //collider: PhysicsCollider2d;

  SetPosition(position: Vector2) {
    this.position = position;
  }

  GetIsPhysics() {
    return this.IsPhysics;
  }

  GetTag(): string {
    return this.Tag;
  }

  SetTag(tag: string) {
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
      this.position = this.localPosition.Add(this._parent.position);
    }
  }

  Update(deltaTime: number) { }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
  }

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

  Instantiate<T extends Behavior>(behavior: T,
    behavior_parent: Behavior | null = null): T {
    Behavior_Instance.behaviors.push(behavior);

    behavior.Load();

    if (behavior_parent !== null) {
      behavior.SetParent(behavior_parent);
    }

    return behavior;
  }



  setIsLoaded(isLoaded: boolean) {
    this._isLoaded = isLoaded;
  }

}