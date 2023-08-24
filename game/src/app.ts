import * as jcls from "jclsengine"

import AsteroideSpawner from "./asteroideSpawner.js";
import Enemy from "./enemy.js";
import Ship from "./ship.js";
import StarBackground from "./starBackground.js";
import StartText from "./startText.js";
import Missile from "./missile.js";
import HealPointBar from "./healPointBar.js";

let RunParent: HTMLElement | null =
  document.getElementById("Run");

let btnRun: HTMLElement | null
  = document.getElementById("btn-run");

btnRun?.addEventListener("click", () => {

  RunParent?.classList.add("hidden");

  let _clip0 = new jcls.Clip();
  _clip0.Load('./assets/musics/gamemusic.mp3');

  let _clip1 = new jcls.Clip();
  _clip0.Load('./assets/musics/gamemusic.mp3');

  let _soundEffect = new jcls.SoundEffect()
  //_soundEffect.SetLoop(true);
  _soundEffect.PlayList([_clip0, _clip1], true);

  jcls.BehaviorPooling.Instance.Create("Missile", () => new Missile(), 10);
  console.log(jcls.BehaviorPooling.Instance)

  const engine = new jcls.JCLSEngine(() => [
    new StartText(),
    //new Enemy(),
    new HealPointBar(),
    new Ship(),
    new AsteroideSpawner(),
    new StarBackground()
  ]);

  let htmlScore: HTMLElement | null
    = document.getElementById("nb-score");

  engine.On('ui', () => {
    if (htmlScore)
      htmlScore.innerHTML
        = "" + Math.round(Ship.instance.score);
  })

})