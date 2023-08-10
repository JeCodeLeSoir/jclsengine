export declare class AnimationKey {
    image: HTMLImageElement | null;
    timeStart: number;
    timeEnd: number;
    margin_start: number;
    margin_end: number;
    isLoaded: boolean;
    src: string;
    constructor(src: string, timeStart: number, timeEnd: number, margin_start: number, margin_end: number);
    Load(): void;
}
export default class Animation {
    keysize: number;
    image_keys: AnimationKey[];
    spacing: number;
    timelen: number;
    time: number;
    isPlaying: boolean;
    Play(): void;
    Stop(): void;
    IsLoaded(): boolean;
    Pause(): void;
    constructor();
    Load(): void;
    Update(deltaTime: number): void;
    getKeyframe(): AnimationKey | null;
}
