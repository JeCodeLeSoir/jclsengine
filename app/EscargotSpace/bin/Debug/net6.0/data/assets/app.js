import AsteroideSpawner from "./asteroideSpawner.js";
import Enemy from "./enemy.js";
import Ship from "./ship.js";
import StarBackground from "./starBackground.js";
import StartText from "./startText.js";
export class Behavior_Instance {
    static behaviors = [];
    static SCREEN_HEIGHT;
    static SCREEN_WIDTH;
}
const __Debug__ = false;
new Behavior_Instance();
(() => {
    const canvas = document.querySelector('canvas');
    if (canvas === null) {
        return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        return;
    }
    canvas.width = 800;
    canvas.height = canvas.width / 2;
    Behavior_Instance.SCREEN_WIDTH = canvas.width;
    Behavior_Instance.SCREEN_HEIGHT = canvas.height;
    console.log(Behavior_Instance.SCREEN_WIDTH + "X" + Behavior_Instance.SCREEN_HEIGHT);
    Behavior_Instance.behaviors.push(new StartText());
    Behavior_Instance.behaviors.push(new Enemy());
    Behavior_Instance.behaviors.push(new Ship());
    Behavior_Instance.behaviors.push(new AsteroideSpawner());
    Behavior_Instance.behaviors.push(new StarBackground());
    Behavior_Instance.behaviors.forEach((behavior) => behavior.Init(ctx));
    Behavior_Instance.behaviors.forEach((behavior) => behavior.Load());
    let previousTime = 0;
    let currentTime = 0;
    let htmlScore = document.getElementById("nb-score");
    let isPaused = false;
    window.addEventListener("blur", (e) => {
        isPaused = true;
    });
    window.addEventListener("click", (e) => {
        isPaused = false;
    });
    const Loop = (timestamp) => {
        currentTime = timestamp;
        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        requestAnimationFrame(Loop);
        if (isPaused) {
            return;
        }
        if (htmlScore)
            htmlScore.innerHTML
                = "" + Math.round(Ship.instance.score);
        Behavior_Instance.behaviors =
            Behavior_Instance.behaviors.filter((behavior) => !behavior.GetIsDestroyed());
        Behavior_Instance.behaviors.forEach((behavior_a) => {
            if (behavior_a.GetIsLoaded() && behavior_a.GetIsPhysics()) {
                let boundsA = behavior_a.GetBoundingBox();
                boundsA?.Update(behavior_a);
                Behavior_Instance.behaviors.forEach((behavior_b) => {
                    if (behavior_a !== behavior_b) {
                        if (behavior_b.GetIsLoaded() && behavior_b.GetIsPhysics()) {
                            let boundsB = behavior_b.GetBoundingBox();
                            boundsB?.Update(behavior_b);
                            if (boundsB !== null) {
                                if (boundsA?.Intersects(boundsB)) {
                                    behavior_a.SetCollisionEnter(true);
                                    behavior_a.OnCollisionEnter(behavior_b);
                                }
                                else {
                                    if (behavior_a.GetCollisionEnter()) {
                                        behavior_a.SetCollisionEnter(false);
                                        behavior_a.OnCollisionExit(behavior_b);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
        Behavior_Instance.behaviors.forEach((behavior) => behavior.GetIsLoaded() ? behavior.Update(deltaTime) : {});
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(31, 31, 31)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let draws = Behavior_Instance.behaviors.sort((a, b) => a.GetDisplayOrder() - b.GetDisplayOrder());
        if (__Debug__) {
            Behavior_Instance.behaviors.forEach((behavior_a) => {
                if (behavior_a.GetIsLoaded() && behavior_a.GetIsPhysics()) {
                    let boundsA = behavior_a.GetBoundingBox();
                    boundsA?.Update(behavior_a);
                    boundsA?.DebugDraw(ctx);
                }
            });
        }
        draws.forEach((behavior) => behavior.GetIsLoaded() ?
            behavior.Draw(ctx, deltaTime) : {});
    };
    requestAnimationFrame(Loop);
})();
