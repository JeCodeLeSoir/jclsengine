import Vector2 from "../core/vector2.js";
import Behavior from "../core/behavior.js";
export declare class Projection {
    min: number;
    max: number;
    constructor(min: number, max: number);
    Overlap(other: Projection): boolean;
    contains(other: Projection): boolean;
    getOverlap(other: Projection): number;
}
export declare class ColliderShap {
    corners: Vector2[];
    center: Vector2;
    rotation: number;
    UpdateShap(center: Vector2, rotation?: number): void;
    project(axis: Vector2): Projection;
    Calculate(): void;
    CheckCollisionWith(ctx: any, other: ColliderShap): MTV;
    DebugCollider(ctx: any): void;
}
export declare class MTV {
    isColliding: boolean;
    axis: Vector2;
    overlap: number;
    constructor(isColliding: boolean, axis: Vector2, overlap: number);
}
export declare class ColliderFunc {
    static CalculeSAT(ctx: any, box_A: Box, box_B: Box, corners_array: Vector2[]): MTV;
    static CheckCollisionBoxBox(ctx: any, box_A: Box, box_B: Box): MTV;
    static ResolveCollisionBoxBox(ctx: any, Phys_A: PhysicsCollider2d, Phys_B: PhysicsCollider2d, mtv: MTV, dt: number): void;
    static CheckCollisionCircleCircle(circle_A: Circle, circle_B: Circle): boolean;
    static CheckCollisionBoxCircle(circle: Circle, box: Box): boolean;
    static CheckCollisionCircleBox(box: Box, circle: Circle): boolean;
    static CheckCollisionBoxPolygon(box: Box, polygon: Polygon): boolean;
}
export declare class Capsule extends ColliderShap {
    radius: number;
    height: number;
    constructor(radius: number, height: number);
    DebugCollider(ctx: any): void;
}
export declare class Polygon extends ColliderShap {
    points: Vector2[];
    constructor(points: Vector2[]);
    DebugCollider(ctx: any): void;
}
export declare class Box extends ColliderShap {
    size: Vector2;
    angle: number;
    constructor(width: number, height: number);
    Calculate(): void;
    CalculateTransformedCorners(): Vector2[];
    DebugCollider(ctx: any): void;
}
export declare class Circle extends ColliderShap {
    radius: number;
    constructor(radius: number);
    DebugCollider(ctx: any): void;
}
export declare class PhysicsCollider2d {
    shap: ColliderShap | null;
    behavior: Behavior | null;
    velocity: Vector2;
    mass: number;
    restitution: number;
    friction: number;
    drag: number;
    private layerName;
    get LayerName(): string;
    set LayerName(layerName: string);
    DebugCollider(ctx: any): void;
    UpdateShap(): void;
    static CheckCollision(ctx: any, a: PhysicsCollider2d, b: PhysicsCollider2d): MTV;
    static ResolveCollision(ctx: any, a: PhysicsCollider2d, b: PhysicsCollider2d, MTV: MTV, dt: number): void;
}
export declare class World {
    gravity: Vector2;
    constructor();
}
export default class Physics {
    world: World;
    colliders: PhysicsCollider2d[];
    private static instance;
    constructor();
    static get Instance(): Physics;
    AddCollider(collider: PhysicsCollider2d): void;
    RemoveCollider(collider: PhysicsCollider2d): void;
    Simulate(ctx: any, dt: number): void;
    private InternalStep;
}
