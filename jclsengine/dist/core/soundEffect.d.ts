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
    Play(clip: Clip): void;
    Stop(): void;
    Pause(): void;
    PlayOneShot(clip: Clip): void;
}
