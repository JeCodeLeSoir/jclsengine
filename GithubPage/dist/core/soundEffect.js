export class Clip {
    isLoaded = false;
    audio = null;
    constructor() {
    }
    Load(sound) {
        this.audio = new Audio();
        this.audio.src = sound;
        this.audio.addEventListener('load', () => {
            this.isLoaded = true;
        });
    }
    GetIsLoaded() {
        return this.isLoaded;
    }
    GetAudio() {
        return this.audio;
    }
}
export default class SoundEffect {
    volume = 0.1;
    isLoop = false;
    SetLoop(isLoop) {
        this.isLoop = isLoop;
    }
    constructor() {
    }
    Play(clip) {
        let audio = clip.GetAudio();
        if (audio) {
            audio.volume = this.volume;
            audio.loop = this.isLoop;
            audio.play();
        }
    }
    Stop() {
    }
    Pause() {
    }
    PlayOneShot(clip) {
        let audio = clip.GetAudio();
        if (audio) {
            audio.volume = this.volume;
            audio.play();
        }
    }
}
