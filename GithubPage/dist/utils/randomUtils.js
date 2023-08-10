export default class RandomUtils {
    static Range(min, max) {
        return Math.random() * (max - min) + min;
    }
}
