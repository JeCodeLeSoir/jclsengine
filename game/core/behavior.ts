import { Behavior_Instance } from "../app.js";
import Bounds from "./bounds.js";

export default abstract class Behavior {

  private _isLoaded: boolean = false;
  private _isDestroyed: boolean = false;
  private _collisionEnter: boolean = false;

  protected Tag: string = "default";

  protected DisplayOrder: number = 0;
  protected IsPhysics: boolean = false;
  protected boundingBox: Bounds | null = null;

  x: number = 0;
  y: number = 0;

  SetPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  GetIsPhysics() {
    return this.IsPhysics;
  }

  GetTag(): string {
    return this.Tag;
  }

  SetCollisionEnter(Enter: boolean) {
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

  Init(ctx: CanvasRenderingContext2D) { }

  Update(deltaTime: number) { }
  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) { }

  Destroy() {
    this._isDestroyed = true;
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

  Instantiate<T extends Behavior>(behavior: T): T {
    Behavior_Instance.behaviors.push(behavior);
    behavior.Load();
    return behavior;
  }

  setIsLoaded(isLoaded: boolean) {
    this._isLoaded = isLoaded;
  }

}