export default class MathF {
    static Clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}
