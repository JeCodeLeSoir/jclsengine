export default class Vector2 {

  public x: number = 0;
  public y: number = 0;

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

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static get zero(): Vector2 {
    return new Vector2();
  }

  static get one(): Vector2 {
    return new Vector2(1, 1);
  }

  static get up(): Vector2 {
    return new Vector2(0, -1);
  }

  static get down(): Vector2 {
    return new Vector2(0, 1);
  }

  static get left(): Vector2 {
    return new Vector2(-1, 0);
  }

  static get right(): Vector2 {
    return new Vector2(1, 0);
  }

  static get positiveInfinity(): Vector2 {
    return new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  static get negativeInfinity(): Vector2 {
    return new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
  }

  static get epsilon(): Vector2 {
    return new Vector2(Number.EPSILON, Number.EPSILON);
  }

  static get max(): Vector2 {
    return new Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
  }

  static get min(): Vector2 {
    return new Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
  }

  get SqrtMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get magnitude(): number {
    return Math.sqrt(this.SqrtMagnitude);
  }

  get normalized(): Vector2 {
    return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
  }

  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  add(vector: Vector2): Vector2 {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  subtract(vector: Vector2): Vector2 {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  multiply(vector: Vector2): Vector2 {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  divide(vector: Vector2): Vector2 {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
  }

  scale(vector: Vector2): Vector2 {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  cross(vector: Vector2): number {
    return this.x * vector.y - this.y * vector.x;
  }

  distance(vector: Vector2): number {
    return Math.sqrt(this.distanceSquared(vector));
  }

  distanceSquared(vector: Vector2): number {
    let dx = this.x - vector.x;
    let dy = this.y - vector.y;
    return dx * dx + dy * dy;
  }

  angle(vector: Vector2): number {
    return Math.atan2(this.cross(vector), this.dot(vector));
  }

  lerp(vector: Vector2, t: number): Vector2 {
    return new Vector2(this.x + (vector.x - this.x) * t, this.y + (vector.y - this.y) * t);
  }

  equals(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

}