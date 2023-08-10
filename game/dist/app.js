import * as jcls from "jclsengine";
import AsteroideSpawner from "./asteroideSpawner.js";
import Enemy from "./enemy.js";
import Ship from "./ship.js";
import StarBackground from "./starBackground.js";
import StartText from "./startText.js";
let RunParent = document.getElementById("Run");
let btnRun = document.getElementById("btn-run");
btnRun?.addEventListener("click", () => {
    RunParent?.classList.add("hidden");
    let _clip = new jcls.Clip();
    _clip.Load('./assets/musics/Deep In Space (Free Game Music).mp3');
    let _soundEffect = new jcls.SoundEffect();
    _soundEffect.SetLoop(true);
    _soundEffect.PlayOneShot(_clip);
    const engine = new jcls.JCLSEngine(() => [
        new StartText(),
        new Enemy(),
        new Ship(),
        new AsteroideSpawner(),
        new StarBackground()
    ]);
    let htmlScore = document.getElementById("nb-score");
    engine.On('ui', () => {
        if (htmlScore)
            htmlScore.innerHTML
                = "" + Math.round(Ship.instance.score);
    });
});
