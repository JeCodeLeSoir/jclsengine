/* Test unit Vector2 */
//const Vector2 = require('../jclsengine/dist/core/vector2.js');
import Vector2 from '../jclsengine/dist/core/vector2.js';
/*test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});*/

test('Vector2 Add', () => {
  let vector2 = new Vector2(1, 2).Add(2);
  expect(vector2.x).toBe(3);
  expect(vector2.y).toBe(4);
});

test('Vector2 Multiply', () => {
  let vector2 = new Vector2(1, 2).Multiply(2);
  expect(vector2.x).toBe(2);
  expect(vector2.y).toBe(4);
});

test('Vector2 Divide', () => {
  let vector2 = new Vector2(1, 2).Divide(2);
  expect(vector2.x).toBe(0.5);
  expect(vector2.y).toBe(1);
});

test('Vector2 Subtract', () => {
  let vector2 = new Vector2(1, 2).Subtract(2);
  expect(vector2.x).toBe(-1);
  expect(vector2.y).toBe(0);
});

test('Vector2 Set', () => {
  let vector2 = new Vector2(1, 2).Set(2, 3);
  expect(vector2.x).toBe(2);
  expect(vector2.y).toBe(3);
});

test('Vector2 Clone', () => {
  let vector2 = new Vector2(1, 2).Clone();
  expect(vector2.x).toBe(1);
  expect(vector2.y).toBe(2);
});

test('Vector2 Dot', () => {
  let a = new Vector2(4, 4)
  let b = new Vector2(2, 4)
  let c = a.Dot(b);
  expect(c).toBe(24);
});

test('Vector2 Cross', () => {
  let a = new Vector2(4, 4)
  let b = new Vector2(2, 4)
  let c = a.Cross(b);
  expect(c).toBe(8);
});


test('Vector2 Angle', () => {
  let a = new Vector2(4, 4)
  let c = a.Angle();
  expect(c).toBe(0.7853981633974483);
});

test('Vector2 AngleBy', () => {
  let a = new Vector2(4, 4)
  let b = new Vector2(2, 4)
  let c = a.AngleBy(b);
  expect(c).toBe(0.3217505543966423);
});


test('Vector2 Distance', () => {
  let vector2 = new Vector2(1, 2).Distance(new Vector2(2, 4));
  expect(vector2).toBe(2.23606797749979);
});

test('Vector2 SqrtDistance', () => {
  let vector2 = new Vector2(1, 2).SqrtDistance(new Vector2(2, 4));
  expect(vector2).toBe(5);
});



test('Vector2 Lerp', () => {
  let vector2 = new Vector2(1, 2).Lerp(new Vector2(2, 4), 0.5);
  expect(vector2.x).toBe(1.5);
  expect(vector2.y).toBe(3);
});

test('Vector2 Equals', () => {
  let vector2 = new Vector2(1, 2).Equals(new Vector2(1, 2));
  expect(vector2).toBe(true);
});

test('Vector2 ToString', () => {
  let vector2 = new Vector2(1, 2).ToString();
  expect(vector2).toBe("(1, 2)");
});

test('Vector2 SqrtMagnitude', () => {
  let c = new Vector2(4, 4).SqrtMagnitude;
  // 1 * 2 + 1 * 2 = 4
  // 4 * 4 + 4 * 4 = 32
  expect(c).toBe(32);
});

test('Vector2 Magnitude', () => {
  let vector2 = new Vector2(4, 4).Magnitude;
  expect(vector2).toBe(5.656854249492381);
});

test('Vector2 Normalized', () => {
  let c = new Vector2(4, 4).Normalized;
  expect(c.x).toBe(0.7071067811865475);
  expect(c.y).toBe(0.7071067811865475);
});

