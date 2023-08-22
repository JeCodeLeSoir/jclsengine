export declare class Clip {
    isLoaded: boolean;
    audio: HTMLAudioElement | null;
    constructor();
    Load(sound: string): void;
    GetIsLoaded(): boolean;
    GetAudio(): HTMLAudioElement | null;
}
export default class SoundEffect {
    volume: number;
    isLoop: boolean;
    SetLoop(isLoop: boolean): void;
    constructor();
    AudioFadeIn(clip: Clip, duration: number, targetVolume: number, startVolume: number, callback: () => void): void;
    AudioFadeOut(clip: Clip, duration: number, targetVolume: number, startVolume: number, callback: () => void): void;
    Play(clip: Clip): void;
    Stop(): void;
    Pause(): void;
    PlayOneShot(clip: Clip): void;
}
