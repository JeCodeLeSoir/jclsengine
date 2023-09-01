import MathF from "../utils/mathf.js";
export default class Vector2 {
    _x = 0;
    _y = 0;
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static get zero() {
        return new Vector2();
    }
    static get one() {
        return new Vector2(1, 1);
    }
    static get up() {
        return new Vector2(0, -1);
    }
    static get down() {
        return new Vector2(0, 1);
    }
    static get left() {
        return new Vector2(-1, 0);
    }
    static get right() {
        return new Vector2(1, 0);
    }
    static get positiveInfinity() {
        return new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
    static get negativeInfinity() {
        return new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    }
    static get epsilon() {
        return new Vector2(Number.EPSILON, Number.EPSILON);
    }
    static get max() {
        return new Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
    }
    static get min() {
        return new Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
    }
    get Normalized() {
        return this.Divide(this.Length() || 1);
    }
    Set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /* Add */
    static Add(_this, vector, clone = true) {
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
    Add(vector) {
        return Vector2.Add(this, vector);
    }
    AddNR(vector) {
        Vector2.Add(this, vector, false);
    }
    /* Add end */
    /* Subtract */
    static Subtract(_this, vector, clone = true) {
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
    Subtract(vector) {
        return Vector2.Subtract(this, vector);
    }
    SubtractNR(vector) {
        Vector2.Subtract(this, vector, false);
    }
    /* Subtract end */
    /* Multiply */
    static Multiply(_this, vector, clone = true) {
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
    Multiply(vector) {
        return Vector2.Multiply(this, vector);
    }
    MultiplyNR(vector) {
        Vector2.Multiply(this, vector, false);
    }
    /* Multiply end */
    /* Divide */
    static Divide(_this, vector, clone = true) {
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
    Divide(vector) {
        return Vector2.Divide(this, vector);
    }
    DivideNR(vector) {
        Vector2.Divide(this, vector, false);
    }
    /* Divide end */
    Dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    Cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    Angle() {
        return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    AngleBy(vector) {
        const denominator = Math.sqrt(this.LengthSq() * vector.LengthSq());
        if (denominator === 0)
            return Math.PI / 2;
        const theta = this.Dot(vector) / denominator;
        return Math.acos(MathF.Clamp(theta, -1, 1));
    }
    Lerp(vector, t) {
        return new Vector2(this.x + (vector.x - this.x) * t, this.y + (vector.y - this.y) * t);
    }
    Equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }
    Clone() {
        return new Vector2(this.x, this.y);
    }
    ToString() {
        return `(${this.x}, ${this.y})`;
    }
    Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    LengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    Distance(vector) {
        return Math.sqrt(this.SqrtDistance(vector));
    }
    get Magnitude() {
        return Math.sqrt(this.SqrtMagnitude);
    }
    get SqrtMagnitude() {
        return this.x * this.x + this.y * this.y; // 1 * 2 + 1 * 2 = 4
    }
    SqrtDistance(vector) {
        const dx = this.x - vector.x, dy = this.y - vector.y;
        return dx * dx + dy * dy;
    }
    RoundNR() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
    Round() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }
    Rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
    RotateAround(angle, pivot) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x - pivot.x;
        const y = this.y - pivot.y;
        return new Vector2(x * cos - y * sin + pivot.x, x * sin + y * cos + pivot.y);
    }
}
