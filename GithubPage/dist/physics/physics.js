import Vector2 from "../core/vector2.js";
/* List of Physics Colliders 2d */
/*export enum Collider2d {
  Box,
  Circle,
  Polygon,
  Capsule,
}*/
export class Projection {
    min = 0;
    max = 0;
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    Overlap(other) {
        return this.max > other.min && other.max > this.min;
    }
    contains(other) {
        return this.min <= other.min && other.max <= this.max;
    }
    getOverlap(other) {
        return Math.min(this.max, other.max) - Math.max(this.min, other.min);
    }
}
export class ColliderShap {
    corners = [];
    center = new Vector2();
    rotation = 0;
    UpdateShap(center, rotation = 0) {
        this.center = center;
        this.rotation = rotation;
        this.Calculate();
    }
    getAxes() {
        const axes = [];
        const corners = this.corners;
        for (let i = 0; i < corners.length; i++) {
            const corner = corners[i];
            //const nextCorner = corners[i + 1 === corners.length ? 0 : i + 1].Clone();
            //const edge = nextCorner.Subtract(corner);
            //const normal = new Vector2(edge.y, -edge.x);
            axes.push(corner.Normalized);
        }
        return axes;
    }
    project(axis) {
        const corners = this.corners;
        const len = corners.length;
        let min = axis.Dot(this.corners[0]);
        let max = min;
        for (let i = 0; i < len; i++) {
            let p = corners[i].Dot(axis);
            if (p < min) {
                min = p;
            }
            if (p > max) {
                max = p;
            }
        }
        return new Projection(min, max);
    }
    Calculate() {
    }
    CheckCollisionWith(ctx, other) {
        let funcName = "CheckCollision" + this.constructor.name + other.constructor.name;
        //console.log(funcName);
        if (ColliderFunc[funcName] !== undefined) {
            return ColliderFunc[funcName](ctx, this, other);
        }
        return new MTV(false, new Vector2(), 0);
    }
    DebugCollider(ctx) {
    }
}
export class MTV {
    isColliding = false;
    axis = new Vector2();
    overlap = 0;
    constructor(isColliding, axis, overlap) {
        this.isColliding = isColliding;
        this.axis = axis;
        this.overlap = overlap;
    }
}
export class ColliderFunc {
    static CalculeSAT(ctx, box_A, box_B, corners_array) {
        let overlap = Number.MAX_VALUE;
        let overlapN = new Vector2();
        //let axes_a = box_A.getAxes();
        //let corners_array = box_A.corners;
        for (let i = 0; i < corners_array.length; i++) {
            let _corner = corners_array[i];
            //let axis = axes_a[i];
            let nextCorner = null;
            if (i + 1 === corners_array.length) {
                nextCorner = corners_array[0];
            }
            else {
                nextCorner = corners_array[i + 1];
            }
            const edge = nextCorner.Subtract(_corner);
            const normal = new Vector2(edge.y, -edge.x);
            let axis = normal.Normalized;
            let p1 = box_A.project(axis);
            let p2 = box_B.project(axis);
            /* debug Projection p1 */
            ctx.save();
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
            ctx.restore();
            if (!p1.Overlap(p2)) {
                return new MTV(false, new Vector2(), 0);
            }
            else {
                let _overlap = p1.getOverlap(p2);
                if (p1.contains(p2) || p2.contains(p1)) {
                    let mins = Math.abs(p1.min - p2.min);
                    let maxs = Math.abs(p1.max - p2.max);
                    if (mins < maxs) {
                        _overlap += mins;
                    }
                    else {
                        _overlap += maxs;
                    }
                }
                if (_overlap < overlap) {
                    overlap = _overlap;
                    overlapN = axis;
                }
            }
        }
        return new MTV(true, overlapN, overlap);
    }
    static CheckCollisionBoxBox(ctx, box_A, box_B) {
        /* check la distance entre A et b */
        let distance = box_A.center.Subtract(box_B.center).Magnitude;
        let minDistance = box_A.size.Magnitude + box_B.size.Magnitude;
        if (distance > minDistance) {
            return new MTV(false, new Vector2(), 0);
        }
        /* Check Collision entre deux rectangles */
        /* Separating Axis Theorem */
        let overlap = 0;
        let overlapN = new Vector2();
        let mvt_1 = ColliderFunc.CalculeSAT(ctx, box_A, box_B, box_A.corners);
        let mvt_2 = ColliderFunc.CalculeSAT(ctx, box_A, box_B, box_B.corners);
        if (mvt_1.isColliding || mvt_2.isColliding) {
            if (mvt_1.overlap < mvt_2.overlap) {
                overlap = mvt_1.overlap;
                overlapN = mvt_1.axis;
            }
            else {
                overlap = mvt_2.overlap;
                overlapN = mvt_2.axis;
            }
        }
        else {
            return new MTV(false, new Vector2(), 0);
        }
        //overlap = mvt_1.overlap;
        //overlapN = mvt_1.axis;
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
        ctx.moveTo(box_A.center.x, box_A.center.y);
        ctx.lineTo(box_A.center.x + overlapN.x * overlap, box_A.center.y + overlapN.y * overlap);
        ctx.stroke();
        ctx.closePath();
        let _MTV = new MTV(true, overlapN, overlap);
        //console.log(overlapN, overlap);
        return _MTV;
    }
    static ResolveCollisionBoxBox(ctx, Phys_A, Phys_B, mtv, dt) {
        /* Resolve Collision entre deux rectangles */
        /* Separating Axis Theorem */
        if (Phys_A.behavior === null || Phys_B.behavior === null)
            return;
        if (Phys_A.shap === null || Phys_B.shap === null)
            return;
        const mass_A = Phys_A.mass;
        const mass_B = Phys_B.mass;
        /* calculer une direction par rapport le centre de l'objet et le mvt */
        const correctionVector = new Vector2(mtv.axis.x * mtv.overlap * dt * (mass_B / (mass_A + mass_B)), mtv.axis.y * mtv.overlap * dt * (mass_A / (mass_A + mass_B)));
        /* affiche la direction de la correction */
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.moveTo(Phys_A.behavior.position.x, Phys_A.behavior.position.y);
        ctx.lineTo(Phys_A.behavior.position.x
            + correctionVector.x, Phys_A.behavior.position.y
            + correctionVector.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        /* vérifier si l'objet A et devent l'objet B */
        let position_A = Phys_A.behavior.position;
        let position_B = Phys_B.behavior.position;
        let direction_A_B = position_B.Subtract(position_A).Normalized;
        let dotProduct = direction_A_B.Dot(mtv.axis);
        console.log("dotProduct :", dotProduct);
        if (dotProduct > 0) {
            Phys_B.behavior.position = Phys_B.behavior.position.Add(correctionVector.Multiply(Phys_B.restitution));
            Phys_A.behavior.position = Phys_A.behavior.position.Subtract(correctionVector.Multiply(Phys_A.restitution));
            Phys_B.velocity = Phys_B.velocity.Add(correctionVector.Multiply(Phys_B.restitution));
            Phys_A.velocity = Phys_A.velocity.Subtract(correctionVector.Multiply(Phys_A.restitution));
        }
        else {
            Phys_A.behavior.position = Phys_A.behavior.position.Add(correctionVector.Multiply(Phys_A.restitution));
            Phys_B.behavior.position = Phys_B.behavior.position.Subtract(correctionVector.Multiply(Phys_B.restitution));
            Phys_A.velocity = Phys_A.velocity.Add(correctionVector.Multiply(Phys_A.restitution));
            Phys_B.velocity = Phys_B.velocity.Subtract(correctionVector.Multiply(Phys_B.restitution));
        }
        //Phys_A.behavior.OnCollisionEnter(Phys_B.behavior);
        //Phys_B.behavior.OnCollisionEnter(Phys_A.behavior);
    }
    static CheckCollisionCircleCircle(circle_A, circle_B) {
        /* Check Collision entre deux cercles */
        return false;
    }
    static CheckCollisionBoxCircle(circle, box) {
        /* Check Collision entre un cercle et un rectangle */
        return false;
    }
    static CheckCollisionCircleBox(box, circle) {
        return ColliderFunc.CheckCollisionBoxCircle(circle, box);
    }
    static CheckCollisionBoxPolygon(box, polygon) {
        return false;
    }
}
export class Capsule extends ColliderShap {
    radius = 0;
    height = 0;
    constructor(radius, height) {
        super();
    }
    DebugCollider(ctx) {
        ctx.strokeStyle = "red";
    }
}
export class Polygon extends ColliderShap {
    points = [];
    constructor(points) {
        super();
        this.points = points;
    }
    DebugCollider(ctx) {
        ctx.strokeStyle = "red";
    }
}
export class Box extends ColliderShap {
    size = new Vector2();
    angle = 35;
    constructor(width, height) {
        super();
        this.size.x = width;
        this.size.y = height;
        this.Calculate();
    }
    Calculate() {
        this.corners = this.CalculateTransformedCorners();
    }
    CalculateTransformedCorners() {
        const corners = [];
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
    radius = 0;
    constructor(radius) {
        super();
        this.radius = radius;
    }
    DebugCollider(ctx) {
        ctx.strokeStyle = "red";
    }
}
export class PhysicsCollider2d {
    //public collider_type: Collider2d = Collider2d.Box;
    shap = null;
    behavior = null;
    velocity = new Vector2(); // pixels per second
    mass = 1; // 0 = infinite mass
    restitution = 1; // 0 = no bounce, 1 = perfect bounce
    friction = 0.5; // 0 = no friction, 1 = high friction
    drag = 0.0001; // 0 = no drag, 1 = full drag
    DebugCollider(ctx) {
        if (this.behavior === null)
            return;
        if (this.shap === null)
            return;
        this.shap.DebugCollider(ctx);
    }
    UpdateShap() {
        if (this.behavior === null)
            return;
        if (this.shap === null)
            return;
        this.shap.UpdateShap(this.behavior.position, this.behavior.rotation);
    }
    static CheckCollision(ctx, a, b) {
        if (a.shap === null || b.shap === null)
            return new MTV(false, new Vector2(), 0);
        return a.shap.CheckCollisionWith(ctx, b.shap);
    }
    static ResolveCollision(ctx, a, b, MTV, dt) {
        if (a.shap === null || b.shap === null)
            return;
        let funcName = "ResolveCollision" + a.shap.constructor.name + b.shap.constructor.name;
        //console.log(funcName);
        if (ColliderFunc[funcName] !== undefined) {
            ColliderFunc[funcName](ctx, a, b, MTV, dt);
        }
    }
}
export class World {
    gravity;
    constructor() {
        this.gravity = new Vector2(0, 0);
    }
}
export default class Physics {
    world;
    colliders;
    static instance;
    constructor() {
        this.world = new World();
        this.colliders = [];
    }
    static get Instance() {
        if (!Physics.instance)
            Physics.instance = new Physics();
        return Physics.instance;
    }
    AddCollider(collider) {
        this.colliders.push(collider);
    }
    RemoveCollider(collider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) {
            this.colliders.splice(index, 1);
        }
    }
    Simulate(ctx, dt) {
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
                    console.log(A_collider.behavior?.constructor.name, "collide with", B_collider.behavior?.constructor.name);
                    PhysicsCollider2d.ResolveCollision(ctx, A_collider, B_collider, MTV, dt);
                }
            }
            A_collider.DebugCollider(ctx);
        }
        /* rigidbody */
        for (let i = 0; i < numColliders - 1; i++) {
            const A_collider = this.colliders[i];
            if (A_collider.behavior === null)
                continue;
            A_collider.behavior.position = A_collider.behavior.position.Add(A_collider.velocity.Multiply(dt));
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
