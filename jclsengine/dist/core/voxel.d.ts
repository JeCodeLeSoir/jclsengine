export declare class PixelData {
    _color: number[];
    _coord: number[];
    _isVoid: boolean;
    constructor(color: number[], coord: number[], isVoid: boolean);
}
export default class Voxel {
    _pixelsData: PixelData[];
    CreateVoxel(img: HTMLImageElement): void;
    DrawVoxel(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): void;
}
