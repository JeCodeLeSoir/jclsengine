import Vector2 from "../core/vector2.js";
import Bounds from "../core/bounds.js";
import Behavior from "../core/behavior.js";

/* List of Physics Colliders 2d */
/*export enum Collider2d {
  Box,
  Circle,
  Polygon,
  Capsule,
}*/

export class Projection {
  min: number = 0;
  max: number = 0;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  Overlap(other: Projection): boolean {
    return this.max > other.min && other.max > this.min;
  }

  contains(other: Projection): boolean {
    return this.min <= other.min && other.max <= this.max;
  }

  getOverlap(other: Projection) {
    return Math.min(this.max, other.max) - Math.max(this.min, other.min);
  }
}

export class ColliderShap {
  corners: Vector2[] = [];

  center: Vector2 = new Vector2();
  rotation: number = 0;

  UpdateShap(center: Vector2, rotation: number = 0) {
    this.center = center;
    this.rotation = rotation;
    this.Calculate();
  }

  getAxes() {

    const axes: Vector2[] = [];

    const corners = this.corners;

    for (let i = 0; i < corners.length; i++) {
      const corner = corners[i].Clone();
      //const nextCorner = corners[i + 1 === corners.length ? 0 : i + 1].Clone();
      //const edge = nextCorner.Subtract(corner);
      //const normal = new Vector2(edge.y, -edge.x);

      axes.push(corner.Normalized);
    }

    return axes;
  }

  project(axis: Vector2) {
    const scalars: number[] = [];
    const corners = this.corners;
    const len = corners.length;

    for (let i = 0; i < len; i++) {
      scalars.push(corners[i].DotProduct(axis));
    }

    return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
  }

  Calculate() {

  }

  CheckCollisionWith(ctx, other: ColliderShap): MTV {
    let funcName = "CheckCollision" + this.constructor.name + other.constructor.name;
    //console.log(funcName);
    if (ColliderFunc[funcName] !== undefined) {
      return ColliderFunc[funcName](ctx, this, other);
    }

    return new MTV(
      false,
      new Vector2(),
      0
    );
  }

  DebugCollider(ctx) {

  }
}

export class MTV {
  public isColliding: boolean = false;
  public axis: Vector2 = new Vector2();
  public overlap: number = 0;
  constructor(
    isColliding: boolean,
    axis: Vector2,
    overlap: number
  ) {
    this.isColliding = isColliding;
    this.axis = axis;
    this.overlap = overlap;
  }
}

export class ColliderFunc {

  static CalculeSAT(ctx, box_A: Box, box_B: Box) {

    let overlap: number = Number.MAX_VALUE;

    let overlapN: Vector2 = new Vector2();

    let axes_a = box_A.getAxes();

    for (let i = 0; i < axes_a.length; i++) {
      let axis = axes_a[i];

      let p1: Projection = box_A.project(axis);
      let p2: Projection = box_B.project(axis);

      /* debug Projection p1 */
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.moveTo(box_A.center.x, box_A.center.y);
      ctx.lineTo(box_A.center.x + axis.x * p1.min, box_A.center.y + axis.y * p1.min);
      ctx.stroke();
      ctx.closePath();

      /* debug Projection p2 */
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.moveTo(box_B.center.x, box_B.center.y);
      ctx.lineTo(box_B.center.x + axis.x * p2.min, box_B.center.y + axis.y * p2.min);
      ctx.stroke();
      ctx.closePath();

      if (!p1.Overlap(p2)) {
        return new MTV(
          false,
          new Vector2(),
          0
        );
      }
      else {
        let _overlap = p1.getOverlap(p2);

        if (p1.contains(p2) || p2.contains(p1)) {
          let mins = Math.abs(p1.min - p2.min);
          let maxs = Math.abs(p1.max - p2.max);
          if (mins < maxs) {
            _overlap += mins;
          } else {
            _overlap += maxs;
          }
        }

        if (_overlap < overlap) {
          overlap = _overlap;
          overlapN = axis;
        }
      }
    }

    return new MTV(
      true,
      overlapN,
      overlap
    );

  }

  static CheckCollisionBoxBox(
    ctx,
    box_A: Box,
    box_B: Box
  ): MTV {
    /* Check Collision entre deux rectangles */
    /* Separating Axis Theorem */
    let overlap: number = 0;
    let overlapN: Vector2 = new Vector2();

    let mvt_1 = ColliderFunc.CalculeSAT(ctx, box_A, box_B);

    if (!mvt_1.isColliding) {
      return new MTV(
        false,
        new Vector2(),
        0
      );
    }

    overlap = mvt_1.overlap;
    overlapN = mvt_1.axis;

    /* affiche un rectangle */
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.translate(box_A.center.x, box_A.center.y);
    ctx.rotate(box_A.rotation * Math.PI / 180);

    const halfWidth = box_A.size.x / 2;
    const halfHeight = box_A.size.y / 2;

    ctx.beginPath();
    ctx.moveTo(-halfWidth, -halfHeight);
    ctx.lineTo(halfWidth, -halfHeight);
    ctx.lineTo(halfWidth, halfHeight);
    ctx.lineTo(-halfWidth, halfHeight);
    ctx.lineTo(-halfWidth, -halfHeight);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();

    /* MTV => Minimum Translation Vector */

    /* affiche le MTV */
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(
      box_A.center.x + 15
      , box_A.center.y + 15
    );
    ctx.lineTo(box_A.center.x + overlapN.x * overlap, box_A.center.y + overlapN.y * overlap);
    ctx.stroke();
    ctx.closePath();

    let _MTV = new MTV(
      true,
      overlapN,
      overlap
    );

    console.log(overlapN, overlap);

    return _MTV;
  }

  static ResolveCollisionBoxBox(
    ctx,
    Phys_A: PhysicsCollider2d,
    Phys_B: PhysicsCollider2d,
    mtv: MTV,
    dt: number
  ): void {
    /* Resolve Collision entre deux rectangles */
    /* Separating Axis Theorem */

    if (Phys_A.behavior === null || Phys_B.behavior === null) return;
    if (Phys_A.shap === null || Phys_B.shap === null) return;

    const mass_A = Phys_A.mass;
    const mass_B = Phys_B.mass;



    const correctionVector = new Vector2(
      mtv.axis.x * mtv.overlap * dt * (mass_B / (mass_A + mass_B)),
      mtv.axis.y * mtv.overlap * dt * (mass_A / (mass_A + mass_B))
    );

    Phys_B.behavior.position = Phys_B.behavior.position.Add(
      correctionVector.Multiply(Phys_B.restitution)
    );

    Phys_A.behavior.position = Phys_A.behavior.position.Subtract(
      correctionVector.Multiply(Phys_A.restitution)
    );

    Phys_A.velocity = Phys_A.velocity.Subtract(
      correctionVector.Multiply(Phys_A.restitution)
    );

    Phys_B.velocity = Phys_B.velocity.Add(
      correctionVector.Multiply(Phys_B.restitution)
    );

    //Phys_A.behavior.OnCollisionEnter(Phys_B.behavior);
    //Phys_B.behavior.OnCollisionEnter(Phys_A.behavior);


  }


  static CheckCollisionCircleCircle(circle_A: Circle, circle_B: Circle): boolean {
    /* Check Collision entre deux cercles */
    return false;
  }

  static CheckCollisionBoxCircle(circle: Circle, box: Box): boolean {
    /* Check Collision entre un cercle et un rectangle */
    return false;
  }

  static CheckCollisionCircleBox(box: Box, circle: Circle): boolean {
    return ColliderFunc.CheckCollisionBoxCircle(circle, box);
  }

  static CheckCollisionBoxPolygon(box: Box, polygon: Polygon): boolean {
    return false;
  }
}

export class Capsule extends ColliderShap {

  radius: number = 0;
  height: number = 0;

  constructor(radius: number, height: number) {
    super();
  }

  DebugCollider(ctx) {
    ctx.strokeStyle = "red";

  }
}

export class Polygon extends ColliderShap {
  points: Vector2[] = [];
  constructor(points: Vector2[]) {
    super();
    this.points = points;
  }
  DebugCollider(ctx) {
    ctx.strokeStyle = "red";
  }
}

export class Box extends ColliderShap {
  size: Vector2 = new Vector2();
  angle: number = 35;

  constructor(width: number, height: number) {
    super();

    this.size.x = width;
    this.size.y = height;

    this.Calculate();
  }

  Calculate() {
    this.corners = this.CalculateTransformedCorners();
  }


  CalculateTransformedCorners() {
    const corners: Vector2[] = [];
    const cosAngle = Math.cos(this.angle * Math.PI / 180);
    const sinAngle = Math.sin(this.angle * Math.PI / 180);

    const halfWidth = this.size.x / 2;
    const halfHeight = this.size.y / 2;

    // Coins du rectangle non-transformé
    const untransformedCorners = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight }
    ];

    // Calculer les coins transformés
    for (const corner of untransformedCorners) {
      const x = corner.x * cosAngle - corner.y * sinAngle + this.center.x;
      const y = corner.x * sinAngle + corner.y * cosAngle + this.center.y;
      corners.push(new Vector2(x, y));
    }

    return corners;
  }

  DebugCollider(ctx) {
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.angle * Math.PI / 180);

    const halfWidth = this.size.x / 2;
    const halfHeight = this.size.y / 2;

    ctx.beginPath();
    ctx.moveTo(-halfWidth, -halfHeight);
    ctx.lineTo(halfWidth, -halfHeight);
    ctx.lineTo(halfWidth, halfHeight);
    ctx.lineTo(-halfWidth, halfHeight);
    ctx.lineTo(-halfWidth, -halfHeight);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();

    ctx.fillStyle = "red";
    for (const corner of this.corners) {
      ctx.beginPath();
      ctx.arc(corner.x, corner.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }

}

export class Circle extends ColliderShap {
  radius: number = 0;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  DebugCollider(ctx) {
    ctx.strokeStyle = "red";
  }
}

export class PhysicsCollider2d {
  //public collider_type: Collider2d = Collider2d.Box;
  public shap: ColliderShap | null = null;
  public behavior: Behavior | null = null;

  public velocity: Vector2 = new Vector2(); // pixels per second
  public mass: number = 1; // 0 = infinite mass
  public restitution: number = 1; // 0 = no bounce, 1 = perfect bounce
  public friction: number = 0.5; // 0 = no friction, 1 = high friction
  public drag: number = 0.0001; // 0 = no drag, 1 = full drag

  DebugCollider(ctx) {
    if (this.behavior === null) return;
    if (this.shap === null) return;

    this.shap.DebugCollider(ctx);
  }

  UpdateShap() {
    if (this.behavior === null) return;
    if (this.shap === null) return;

    this.shap.UpdateShap(
      this.behavior.position,
      this.behavior.rotation
    );
  }

  static CheckCollision(
    ctx,
    a: PhysicsCollider2d,
    b: PhysicsCollider2d
  ): MTV {

    if (a.shap === null || b.shap === null) return new MTV(
      false,
      new Vector2(),
      0
    );

    return a.shap.CheckCollisionWith(ctx, b.shap);
  }

  static ResolveCollision(
    ctx,
    a: PhysicsCollider2d,
    b: PhysicsCollider2d,
    MTV: MTV,
    dt: number
  ) {
    if (a.shap === null || b.shap === null) return;
    let funcName = "ResolveCollision" + a.shap.constructor.name + b.shap.constructor.name;
    //console.log(funcName);
    if (ColliderFunc[funcName] !== undefined) {
      ColliderFunc[funcName](ctx, a, b, MTV, dt);
    }
  }

}

export class World {
  public gravity: Vector2;

  constructor() {
    this.gravity = new Vector2(0, 0);
  }
}

export default class Physics {

  public world: World;
  public colliders: PhysicsCollider2d[];

  private static instance: Physics;

  constructor() {
    this.world = new World();
    this.colliders = [];
  }

  static get Instance() {
    if (!Physics.instance)
      Physics.instance = new Physics();

    return Physics.instance;
  }

  AddCollider(collider: PhysicsCollider2d) {
    this.colliders.push(collider);
  }

  RemoveCollider(collider: PhysicsCollider2d) {
    const index = this.colliders.indexOf(collider);
    if (index > -1) {
      this.colliders.splice(index, 1);
    }
  }

  Simulate(ctx, dt: number) {
    this.InternalStep(ctx, dt);
  }

  InternalStep(ctx, dt) {
    const numColliders = this.colliders.length;

    for (let i = 0; i < numColliders - 1; i++) {
      const A_collider = this.colliders[i];
      A_collider.UpdateShap();
      for (let j = i + 1; j < numColliders; j++) {
        const B_collider = this.colliders[j];
        const MTV = PhysicsCollider2d.CheckCollision(ctx, A_collider, B_collider);
        if (MTV.isColliding) {
          PhysicsCollider2d.ResolveCollision(ctx, A_collider, B_collider, MTV, dt);
        }
      }
      A_collider.DebugCollider(ctx);
    }

    /* rigidbody */
    for (let i = 0; i < numColliders - 1; i++) {
      const A_collider = this.colliders[i];
      if (A_collider.behavior === null) continue;

      A_collider.behavior.position = A_collider.behavior.position.Add(
        A_collider.velocity.Multiply(dt)
      );

      A_collider.velocity = A_collider.velocity.Multiply(1 - A_collider.drag).Multiply(dt);

      if (A_collider.velocity.Magnitude < 0.01) {
        A_collider.velocity = Vector2.zero;
      }

      //A_collider.behavior.rotation += A_collider.velocity.Magnitude * 0.1;
      A_collider.UpdateShap();

      //A_collider.DebugCollider(ctx);


    }

  }
}