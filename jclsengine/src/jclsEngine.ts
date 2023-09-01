import Behavior from "./core/behavior.js";
import Bounds from "./core/bounds.js";
import Input from "./core/input.js";
import Vector2 from "./core/vector2.js";
import Physics, { PhysicsCollider2d } from "./physics/physics.js";

export class Behavior_Instance {
  static behaviors: Behavior[] = [];

  static SCREEN_HEIGHT: number;
  static SCREEN_WIDTH: number;
}

const __Debug__ = false;

export default class JCLSEngine {

  On(event: string, callback: () => void) {
    if (event === "load") {
      window.addEventListener("loadEngine", callback);
    }
    if (event === "ui") {
      window.addEventListener("ui", callback);
    }
  }

  ReSize(ratio, canvas) {
    /* garder le meme ratio */

    if (window.innerWidth / window.innerHeight > ratio) {
      canvas.style.width = window.innerHeight * ratio + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    else {
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerWidth / ratio + 'px';
    }

    Behavior_Instance.SCREEN_WIDTH = canvas.width;
    Behavior_Instance.SCREEN_HEIGHT = canvas.height;
  }

  constructor(_callback: () => Behavior[]) {
    new Behavior_Instance();

    const canvas: HTMLCanvasElement | null
      = document.querySelector('canvas');
    if (canvas === null) {
      throw new Error("Canvas not found");
    }

    const ctx: CanvasRenderingContext2D | null
      = canvas.getContext('2d');
    if (ctx === null) {
      throw new Error("Canvas context not found");
    }
    ctx.imageSmoothingEnabled = false;

    canvas.width = 800;
    canvas.height = canvas.width / 2;
    let ratio = canvas.width / canvas.height;

    this.ReSize(ratio, canvas)
    window.addEventListener("resize", () => this.ReSize(ratio, canvas));

    Behavior_Instance.SCREEN_WIDTH = canvas.width;
    Behavior_Instance.SCREEN_HEIGHT = canvas.height;

    console.log(Behavior_Instance.SCREEN_WIDTH + "X" + Behavior_Instance.SCREEN_HEIGHT);

    const _behaviors = _callback();
    _behaviors.forEach((behavior) => Behavior_Instance.behaviors.push(behavior));

    Behavior_Instance.behaviors.forEach((behavior) => behavior.Init(ctx));

    /*
           test physic
        */

    let physics = Physics.Instance;

    /*Behavior_Instance.behaviors.forEach((behavior) => {
      behavior.On('load', () => {
        console.log(behavior.GetIsPhysics(), behavior);
        if (behavior.GetIsPhysics()) {
          let newp = new PhysicsCollider2d();
          newp.behavior = behavior;
          newp.shap = behavior.shap;
          physics.AddCollider(newp);
        }
      })
    })*/

    /*
       end test physic
      */

    Behavior_Instance.behaviors.forEach((behavior) => behavior.Load());

    let previousTime = 0;
    let currentTime = 0;

    let isPaused = false;

    window.addEventListener("blur", (e) => {
      isPaused = true;
    });

    window.addEventListener("click", (e) => {
      isPaused = false;
    });

    const Loop = (timestamp) => {
      ctx.imageSmoothingEnabled = false;
      currentTime = timestamp;
      const deltaTime = (currentTime - previousTime) / 1000;
      previousTime = currentTime;

      requestAnimationFrame(Loop);

      if (isPaused) {
        return;
      }

      /* call event ui */
      window.dispatchEvent(new Event("ui"));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgb(31, 31, 31)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      Behavior_Instance.behaviors =
        Behavior_Instance.behaviors.filter((behavior) =>
          !behavior.GetIsDestroyed()
        );

      /*Behavior_Instance.behaviors.forEach((behavior_a) => {
        if (behavior_a.GetIsLoaded() && behavior_a.GetIsPhysics()) {
          let boundsA =
            behavior_a.GetBoundingBox();

          boundsA?.Update(behavior_a.position);

          Behavior_Instance.behaviors.forEach((behavior_b) => {
            if (behavior_a !== behavior_b) {
              if (behavior_b.GetIsLoaded() && behavior_b.GetIsPhysics()) {
                let boundsB =
                  behavior_b.GetBoundingBox();

                boundsB?.Update(behavior_b.position);

                if (boundsB !== null) {
                  if (boundsA?.Intersects(boundsB)) {
                    behavior_a.SetCollisionEnter(true);
                    behavior_a.OnCollisionEnter(behavior_b);
                  } else {
                    if (behavior_a.GetCollisionEnter()) {
                      behavior_a.SetCollisionEnter(false);
                      behavior_a.OnCollisionExit(behavior_b);
                    }
                  }
                }
              }
            }
          })
        }
      });*/



      Behavior_Instance.behaviors.forEach((behavior) => {
        if (behavior.GetIsLoaded() && behavior.IsEnabled) {
          behavior.Update(deltaTime)
          behavior.ApplyTransform();
        }
      });

      let draws = Behavior_Instance.behaviors.sort((a, b) =>
        a.GetDisplayOrder() - b.GetDisplayOrder()
      );

      /*if (__Debug__) {
        Behavior_Instance.behaviors.forEach((behavior_a) => {
          if (behavior_a.GetIsLoaded() && behavior_a.GetIsPhysics()) {
            let boundsA =
              behavior_a.GetBoundingBox();
            boundsA?.Update(behavior_a.position);
            boundsA?.DebugDraw(ctx);
          }
        });
      }*/



      draws.forEach((behavior) =>
        behavior.GetIsLoaded() && behavior.IsEnabled ?
          behavior.Draw(ctx, deltaTime) : {}
      );

      /*
        test physic
      */


      physics.Simulate(ctx, deltaTime);
      Input.Instance.Update(deltaTime);

      /*
       end test physic
      */

    }

    requestAnimationFrame(Loop);
    window.dispatchEvent(new Event("loadEngine"));
  }
}