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
    volume = 1;
    isLoop = false;
    SetLoop(isLoop) {
        this.isLoop = isLoop;
    }
    constructor() {
    }
    AudioFadeIn(clip, duration, targetVolume, startVolume, callback) {
    }
    AudioFadeOut(clip, duration, targetVolume, startVolume, callback) {
    }
    Play(clip) {
        let audio = clip.GetAudio();
        if (audio) {
            audio.volume = this.volume / 100;
            audio.loop = this.isLoop;
            audio.play();
        }
        else {
            console.warn("audio is null");
        }
    }
    PlayEnded(clip, callback_Ended) {
        let audio = clip.GetAudio();
        if (audio) {
            audio.volume = this.volume / 100;
            //audio.loop = this.isLoop;
            audio.play();
            audio.addEventListener('ended', () => callback_Ended());
        }
        else {
            console.warn("audio is null");
        }
    }
    index = 0;
    clips = [];
    isLoopList = false;
    PlayList(_clips, _isLoop) {
        this.clips = _clips;
        this.isLoopList = _isLoop;
        if (this.clips.length > 0) {
            this.index = 0;
            const ended = () => {
                console.log("ended");
                if (this.isLoopList === false)
                    return;
                console.log("next");
                this.index++;
                console.log(this.index + "<" + this.clips.length);
                console.log(this.clips[this.index]);
                if (this.index < this.clips.length) {
                    console.log("play next");
                    this.PlayEnded(this.clips[this.index], ended);
                }
            };
            this.PlayEnded(this.clips[this.index], ended);
        }
    }
    Stop() {
    }
    Pause() {
    }
    PlayOneShot(clip) {
        let audio = clip.GetAudio();
        if (audio) {
            audio.volume = this.volume / 100;
            audio.play();
        }
    }
}
