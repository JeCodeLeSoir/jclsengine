import * as jcls from "jclsengine";
export default class Tags extends jcls.Tags {
    static Asteroide = 0x1 + 0x1;
    static Player_Laser = 0x2 + 0x1;
    static Player = 0x3 + 0x1;
    static Player_Missile = 0x4 + 0x1;
    static Enemy = 0x5 + 0x1;
    static Enemy_Laser = 0x6 + 0x1;
    static Enemy_Missile = 0x7 + 0x1;
    static TestCollision = 0x8 + 0x1;
}
