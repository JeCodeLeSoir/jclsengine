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

  volume: number = 0.1;
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
      audio.volume = this.volume;
      audio.loop = this.isLoop;
      audio.play();
    }
  }

  index: number = 0;
  PlayList(clips: Clip[], isLoop: boolean) {
    if (clips.length > 0) {
      this.index = 0;
      this.Play(clips[this.index]);
      clips[this.index].GetAudio()?.addEventListener('ended', () => {

        if (!isLoop && this.index == clips.length - 1)
          return;

        this.index++;

        if (this.index < clips.length) {
          this.Play(clips[this.index]);
        }
      });
    }
  }

  Stop() {

  }

  Pause() {
  }

  PlayOneShot(clip: Clip) {
    let audio = clip.GetAudio()
    if (audio) {
      audio.volume = this.volume;
      audio.play();
    }
  }
}