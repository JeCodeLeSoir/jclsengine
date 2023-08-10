import Bounds from "./bounds.js";
import Vector2 from "./vector2.js";
export default abstract class Behavior {
    private _isLoaded;
    private _isDestroyed;
    private _collisionEnter;
    private _parent;
    protected Tag: string;
    protected DisplayOrder: number;
    protected IsPhysics: boolean;
    protected boundingBox: Bounds | null;
    SetParent(parent: Behavior): void;
    GetParent(): Behavior | null;
    localPosition: Vector2;
    position: Vector2;
    SetPosition(position: Vector2): void;
    GetIsPhysics(): boolean;
    GetTag(): string;
    SetTag(tag: string): void;
    SetCollisionEnter(Enter: boolean): void;
    GetCollisionEnter(): boolean;
    GetBoundingBox(): Bounds | null;
    GetDisplayOrder(): number;
    Load(): void;
    Init(ctx: CanvasRenderingContext2D): void;
    ApplyTransform(): void;
    Update(deltaTime: number): void;
    Draw(ctx: CanvasRenderingContext2D, deltaTime: number): void;
    Destroy(): void;
    abstract OnDestroy(): void;
    OnCollisionEnter(other: Behavior): void;
    OnCollisionExit(other: Behavior): void;
    GetIsDestroyed(): boolean;
    GetIsLoaded(): boolean;
    Instantiate<T extends Behavior>(behavior: T, behavior_parent?: T | null): T;
    setIsLoaded(isLoaded: boolean): void;
}
