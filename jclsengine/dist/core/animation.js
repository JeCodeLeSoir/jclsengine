export class AnimationKey {
    image = null;
    timeStart = 0;
    timeEnd = 0;
    margin_start = 0;
    margin_end = 0;
    isLoaded = false;
    src;
    constructor(src, timeStart, timeEnd, margin_start, margin_end) {
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
        });
    }
}
export default class Animation {
    keysize = 0; // fr : nombre de keyframes
    image_keys = []; // fr : liste des keyframes
    spacing = 0; // fr : espace entre les images
    timelen = 0; // fr : temps total de l'animation
    time = 0; // fr : temps actuel de l'animation
    isPlaying = false; // fr : est en train de jouer
    Play() {
        this.isPlaying = true;
    }
    Stop() {
        this.isPlaying = false;
        this.time = 0;
    }
    IsLoaded() {
        let isLoaded = true;
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
    Update(deltaTime) {
        if (!this.isPlaying)
            return;
        this.time += deltaTime;
        if (this.time > this.timelen) {
            this.time = 0;
        }
    }
    getKeyframe() {
        let keyframe = null;
        for (let i = 0; i < this.keysize; i++) {
            if (this.time > this.image_keys[i].timeStart && this.time < this.image_keys[i].timeEnd) {
                keyframe = this.image_keys[i];
                break;
            }
        }
        return keyframe;
    }
}
