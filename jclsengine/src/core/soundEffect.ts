export class Clip {
  isLoaded: boolean = false;
  audio: HTMLAudioElement | null = null;

  constructor() {
  }

  Load(sound: string) {
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

  volume: number = 1;
  isLoop: boolean = false;

  SetLoop(isLoop: boolean) {
    this.isLoop = isLoop;
  }

  constructor() {

  }

  AudioFadeIn(
    clip: Clip,
    duration: number,
    targetVolume: number,
    startVolume: number,
    callback: () => void
  ) {

  }

  AudioFadeOut(
    clip: Clip,
    duration: number,
    targetVolume: number,
    startVolume: number,
    callback: () => void
  ) {

  }

  Play(clip: Clip) {

    let audio = clip.GetAudio()

    if (audio) {
      audio.volume = this.volume / 100;
      audio.loop = this.isLoop;
      audio.play();
    }
    else {
      console.warn("audio is null")
    }
  }

  PlayEnded(clip: Clip, callback_Ended: () => void) {
    let audio = clip.GetAudio()
    if (audio) {
      audio.volume = this.volume / 100;
      //audio.loop = this.isLoop;
      audio.play();
      audio.addEventListener('ended', () =>
        callback_Ended()
      );
    }
    else {
      console.warn("audio is null")
    }
  }

  index: number = 0;
  clips: Clip[] = [];
  isLoopList: boolean = false;

  PlayList(_clips: Clip[], _isLoop: boolean) {
    this.clips = _clips;
    this.isLoopList = _isLoop;

    if (this.clips.length > 0) {
      this.index = 0;
      const ended = () => {
        console.log("ended")
        if (this.isLoopList === false) return;
        console.log("next")
        this.index++;

        console.log(this.index + "<" + this.clips.length)
        console.log(this.clips[this.index])

        if (this.index < this.clips.length) {
          console.log("play next");
          this.PlayEnded(this.clips[this.index], ended);
        }
      }
      this.PlayEnded(this.clips[this.index], ended);
    }
  }

  Stop() {

  }

  Pause() {
  }

  PlayOneShot(clip: Clip) {
    let audio = clip.GetAudio()
    if (audio) {
      audio.volume = this.volume / 100;
      audio.play();
    }
  }
}