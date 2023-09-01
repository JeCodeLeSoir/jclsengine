import * as jcls from "jclsengine"

export default class Tags extends jcls.Tags {
  static Asteroide: number = 0x1 + 0x1;

  static Player_Laser: number = 0x2 + 0x1;
  static Player: number = 0x3 + 0x1;
  static Player_Missile: number = 0x4 + 0x1;

  static Enemy: number = 0x5 + 0x1;
  static Enemy_Laser: number = 0x6 + 0x1;
  static Enemy_Missile: number = 0x7 + 0x1;

  static TestCollision: number = 0x8 + 0x1;
}