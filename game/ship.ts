import { Behavior_Instance } from "./app.js";
import Behavior from "./core/behavior.js";
import Bounds, { Vector2 } from "./core/bounds.js";
import Missile from "./missile.js";

export enum Input {
  forward,
  backward,
  left,
  right,
  space,
  shift
}

export default class Ship extends Behavior {

  static instance: Ship;

  protected Tag: string = "player";
  protected IsPhysics: boolean = true;
  protected DisplayOrder: number = 2;

  image: HTMLImageElement;
  height: number = 0;
  width: number = 0;

  speed: number;
  rotation: number;

  inputs: boolean[] = [];

  cooldown: number = 0;
  cooldownMax: number = 0.5;

  score: number = 0;

  constructor() {
    super();
    this.x = 25;
    this.y = Behavior_Instance.SCREEN_HEIGHT / 2;
    this.speed = 150;
    this.rotation = 0;
    this.image = new Image();

    Ship.instance = this;
  }

  Load() {
    this.image.src = './player.png';
    this.image.addEventListener('load', () => {
      this.height = this.image.height;
      this.width = this.image.width;

      this.boundingBox = new Bounds(new
        Vector2(this.x, this.y), new
        Vector2(this.width, this.height));

      this.setIsLoaded(true);
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'z') {
        this.inputs[Input.forward] = true;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        this.inputs[Input.backward] = true;
      }
      if (e.key === 'ArrowLeft' || e.key === 'q') {
        this.inputs[Input.left] = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.inputs[Input.right] = true;
      }
      if (e.key === ' ') {
        this.inputs[Input.space] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'z') {
        this.inputs[Input.forward] = false;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        this.inputs[Input.backward] = false;
      }
      if (e.key === 'ArrowLeft' || e.key === 'q') {
        this.inputs[Input.left] = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.inputs[Input.right] = false;
      }
      if (e.key === ' ') {
        this.inputs[Input.space] = false;
      }
    });
  }

  Update(deltaTime: number) {
    if (this.inputs[Input.forward]) {
      this.y -= this.speed * deltaTime;
    }
    if (this.inputs[Input.backward]) {
      this.y += this.speed * deltaTime;
    }
    if (this.inputs[Input.left]) {
      this.x -= this.speed * deltaTime;
    }
    if (this.inputs[Input.right]) {
      this.x += this.speed * deltaTime;
    }
    if (this.inputs[Input.space]) {
      if (this.cooldown <= 0) {
        this.cooldown = this.cooldownMax;
        this.Instantiate(new Missile()).SetPosition(this.x + this.width / 2, this.y);
      }
    }

    this.cooldown -= deltaTime;
    this.score += 0.025 * deltaTime;
  }

  Draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.drawImage(this.image,
      Math.round(this.x - this.width / 2),
      Math.round(this.y - this.height / 2)
    );
  }

  OnDestroy(): void {
    window.location.reload();
  }

  OnCollisionEnter(other: Behavior): void {
    if (other.GetTag() === "Asteroide") {
      this.Destroy();
    }
  }
}