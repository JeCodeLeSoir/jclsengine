import MathF from "../utils/mathf.js";

export default class Vector2 {
  private _x: number = 0;
  private _y: number = 0;

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

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

  get Normalized(): Vector2 {
    return this.Divide(this.Length() || 1);
  }

  Set(x: number, y: number): Vector2 {

    this.x = x;
    this.y = y;

    return this;
  }

  /* Add */

  private static Add(
    _this: Vector2,
    vector: Vector2 | number,
    clone: boolean = true): Vector2 {
    let a = clone ? _this.Clone() : _this;

    if (typeof vector === "number") {
      a.x += vector;
      a.y += vector;
      return a;
    }

    a.x += vector.x;
    a.y += vector.y;

    return a;
  }

  Add(vector: Vector2 | number): Vector2 {
    return Vector2.Add(this, vector);
  }

  AddNR(vector: Vector2 | number) {
    Vector2.Add(this, vector, false);
  }

  /* Add end */

  /* Subtract */
  private static Subtract(
    _this: Vector2,
    vector: Vector2 | number,
    clone: boolean = true): Vector2 {
    let a = clone ? _this.Clone() : _this;

    if (typeof vector === "number") {
      a.x -= vector;
      a.y -= vector;
      return a;
    }

    a.x -= vector.x;
    a.y -= vector.y;

    return a;
  }

  Subtract(vector: Vector2 | number): Vector2 {
    return Vector2.Subtract(this, vector);
  }

  SubtractNR(vector: Vector2 | number) {
    Vector2.Subtract(this, vector, false);
  }

  /* Subtract end */

  /* Multiply */

  private static Multiply(
    _this: Vector2,
    vector: Vector2 | number,
    clone: boolean = true): Vector2 {

    let a = clone ? _this.Clone() : _this;
    if (typeof vector === "number") {
      a.x *= vector;
      a.y *= vector;
      return a;
    }

    a.x *= vector.x;
    a.y *= vector.y;

    return a;
  }

  Multiply(vector: Vector2 | number): Vector2 {
    return Vector2.Multiply(this, vector);
  }

  MultiplyNR(vector: Vector2 | number) {
    Vector2.Multiply(this, vector, false);
  }

  /* Multiply end */


  /* Divide */

  private static Divide(
    _this: Vector2,
    vector: Vector2 | number,
    clone: boolean = true): Vector2 {
    let a = clone ? _this.Clone() : _this;

    if (typeof vector === "number") {
      a.x /= vector;
      a.y /= vector;
      return a;
    }

    a.x /= vector.x;
    a.y /= vector.y;
    return a;
  }

  Divide(vector: Vector2 | number): Vector2 {
    return Vector2.Divide(this, vector);
  }

  DivideNR(vector: Vector2 | number) {
    Vector2.Divide(this, vector, false);
  }

  /* Divide end */

  Dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  Cross(vector: Vector2): number {
    return this.x * vector.y - this.y * vector.x;
  }

  Angle() {
    return Math.atan2(- this.y, - this.x) + Math.PI
  }

  AngleBy(vector: Vector2): number {
    const denominator = Math.sqrt(this.LengthSq() * vector.LengthSq());
    if (denominator === 0) return Math.PI / 2;
    const theta = this.Dot(vector) / denominator;
    return Math.acos(MathF.Clamp(theta, - 1, 1));
  }

  Lerp(vector: Vector2, t: number): Vector2 {
    return new Vector2(this.x + (vector.x - this.x) * t, this.y + (vector.y - this.y) * t);
  }

  Equals(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  Clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  ToString(): string {
    return `(${this.x}, ${this.y})`;
  }


  Length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  LengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  Distance(vector: Vector2): number {
    return Math.sqrt(this.SqrtDistance(vector));
  }

  get Magnitude(): number {
    return Math.sqrt(this.SqrtMagnitude);
  }

  get SqrtMagnitude() {
    return this.x * this.x + this.y * this.y; // 1 * 2 + 1 * 2 = 4
  }

  SqrtDistance(vector: Vector2): number {
    const dx = this.x - vector.x, dy = this.y - vector.y;
    return dx * dx + dy * dy;
  }

  RoundNR() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  Round(): Vector2 {
    return new Vector2(Math.round(this.x), Math.round(this.y));
  }

  Rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  RotateAround(angle: number, pivot: Vector2): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x - pivot.x;
    const y = this.y - pivot.y;
    return new Vector2(x * cos - y * sin + pivot.x, x * sin + y * cos + pivot.y);
  }
}