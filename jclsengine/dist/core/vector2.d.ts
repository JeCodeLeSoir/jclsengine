export default class Vector2 {
    x: number;
    y: number;
    /**
     * Creates a new Vector2 instance.
     * @param x The x component of the vector.
     * @param y The y component of the vector.
     * @returns A new Vector2 instance.
     * @example
     * let vector = new Vector2(1, 1);
     * console.log(vector.x); // 1
     * console.log(vector.y); // 1
     * console.log(vector); // Vector2 { x: 1, y: 1 }
     * console.log(vector.toString()); // (1, 1)
     * console.log(vector.magnitude); // 1.4142135623730951
     * console.log(vector.normalized); // Vector2 { x: 0.7071067811865475, y: 0.7071067811865475 }
     * console.log(vector.normalized.magnitude); // 1
     * console.log(vector.normalized.toString()); // (0.7071067811865475, 0.7071067811865475)
     * console.log(vector.normalized.normalized); // Vector2 { x: 0.7071067811865475, y: 0.7071067811865475 }
     * console.log(vector.normalized.normalized.magnitude); // 1
     * console.log(vector.normalized.normalized.toString()); // (0.7071067811865475, 0.7071067811865475)
     * console.log(vector.normalized.normalized.normalized); // Vector2 { x: 0.7071067811865475, y: 0.7071067811865475 }
     */
    constructor(x?: number, y?: number);
    static get zero(): Vector2;
    static get one(): Vector2;
    static get up(): Vector2;
    static get down(): Vector2;
    static get left(): Vector2;
    static get right(): Vector2;
    static get positiveInfinity(): Vector2;
    static get negativeInfinity(): Vector2;
    static get epsilon(): Vector2;
    static get max(): Vector2;
    static get min(): Vector2;
    get SqrtMagnitude(): number;
    get Magnitude(): number;
    get Normalized(): Vector2;
    Set(x: number, y: number): Vector2;
    Add(vector: Vector2 | number): Vector2;
    Subtract(vector: Vector2 | number): Vector2;
    Multiply(vector: Vector2 | number): Vector2;
    Divide(vector: Vector2 | number): Vector2;
    Scale(vector: Vector2): Vector2;
    Dot(vector: Vector2): number;
    Cross(vector: Vector2): number;
    Distance(vector: Vector2): number;
    DistanceSquared(vector: Vector2): number;
    Angle(vector: Vector2): number;
    Lerp(vector: Vector2, t: number): Vector2;
    Equals(vector: Vector2): boolean;
    DotProduct(vector: Vector2): number;
    Clone(): Vector2;
    ToString(): string;
}
