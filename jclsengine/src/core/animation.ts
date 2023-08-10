export class AnimationKey {

  image: HTMLImageElement | null = null;

  timeStart: number = 0;
  timeEnd: number = 0;

  margin_start: number = 0;
  margin_end: number = 0;

  isLoaded: boolean = false;

  src: string;

  constructor(src: string, timeStart: number, timeEnd: number, margin_start: number, margin_end: number) {
    this.src = src;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.margin_start = margin_start;
    this.margin_end = margin_end;
  }

  Load() {
    this.image = new Image();
    this.image.src = this.src;
    this.image.addEventListener('load', () => {
      this.isLoaded = true;
    })
  }

}

export default class Animation {
  keysize: number = 0; // fr : nombre de keyframes
  image_keys: AnimationKey[] = []; // fr : liste des keyframes

  spacing: number = 0; // fr : espace entre les images
  timelen: number = 0; // fr : temps total de l'animation

  time: number = 0; // fr : temps actuel de l'animation

  isPlaying: boolean = false; // fr : est en train de jouer

  Play() {
    this.isPlaying = true;
  }

  Stop() {
    this.isPlaying = false;
    this.time = 0;
  }

  IsLoaded(): boolean {
    let isLoaded: boolean = true;
    for (let i = 0; i < this.keysize; i++) {
      if (!this.image_keys[i].isLoaded) {
        isLoaded = false;
        break;
      }
    }
    return isLoaded;
  }

  Pause() {
    this.isPlaying = false;
  }

  constructor() {

  }

  Load() {
    for (let i = 0; i < this.keysize; i++) {
      this.image_keys[i].Load();
    }
  }

  Update(deltaTime: number) {

    if (!this.isPlaying) return;

    this.time += deltaTime;
    if (this.time > this.timelen) {
      this.time = 0;
    }
  }

  getKeyframe(): AnimationKey | null {
    let keyframe: AnimationKey | null = null;
    for (let i = 0; i < this.keysize; i++) {
      if (this.time > this.image_keys[i].timeStart && this.time < this.image_keys[i].timeEnd) {
        keyframe = this.image_keys[i];
        break;
      }
    }
    return keyframe;
  }

}