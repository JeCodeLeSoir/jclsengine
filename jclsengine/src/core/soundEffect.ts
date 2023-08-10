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

  Play(clip: Clip) {
    let audio = clip.GetAudio()
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

  PlayOneShot(clip: Clip) {
    let audio = clip.GetAudio()
    if (audio) {
      audio.volume = this.volume;
      audio.play();
    }
  }
}