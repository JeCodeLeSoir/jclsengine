export default class RandomUtils {
  public static Range(min: number, max: number)
    : number {
    return Math.random() * (max - min) + min;
  }
}