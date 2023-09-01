import * as jcls from "jclsengine";
import Ship from "./ship.js";
import Missile from "./missile.js";
import HealPointBar from "./healPointBar.js";
import TestCollision from "./TestCollision.js";
import ShipEffect from "./ShipEffect.js";
let RunParent = document.getElementById("Run");
let btnRun = document.getElementById("btn-run");
btnRun?.addEventListener("click", () => {
    RunParent?.classList.add("hidden");
    let _clip0 = new jcls.Clip();
    _clip0.Load('./assets/musics/gamemusic2.mp3');
    let _clip1 = new jcls.Clip();
    _clip1.Load('./assets/musics/gamemusic.mp3');
    let _soundEffect = new jcls.SoundEffect();
    //_soundEffect.SetLoop(true);
    let list = [_clip0, _clip1];
    console.log(list);
    _soundEffect.PlayList(list, true);
    jcls.BehaviorPooling.Instance.Create("Missile", () => new Missile(), 10);
    console.log(jcls.BehaviorPooling.Instance);
    const engine = new jcls.JCLSEngine(() => {
        let ship = new Ship();
        return [
            //new StartText(),
            //new Enemy(),
            new HealPointBar(),
            ship,
            new ShipEffect(ship),
            new TestCollision(),
            //new AsteoideVoxel(),
            //new AsteroideSpawner(),
            //new StarBackground()
        ];
    });
    let htmlScore = document.getElementById("nb-score");
    engine.On('ui', () => {
        if (htmlScore && Ship.instance)
            htmlScore.innerHTML
                = "" + Math.round(Ship.instance.score);
    });
});
