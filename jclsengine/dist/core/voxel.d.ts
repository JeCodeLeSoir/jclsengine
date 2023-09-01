import Vector2 from "./vector2";
export declare class PixelData {
    _id: number;
    _color: number[];
    _coord: number[];
    _isVoid: boolean;
    _neighbor: PixelData[];
    constructor(color: number[], coord: number[], isVoid: boolean);
}
export declare class EventVoxel extends Event {
    _voxel: Voxel;
    _group: Group[];
    constructor(type: string, voxel: Voxel, group?: Group[]);
}
export declare class Group {
    _pixelsData: PixelData[];
    _color_group: number[];
    get pixelsData(): PixelData[];
}
export default class Voxel {
    _pixelsData: PixelData[];
    _width: number;
    _height: number;
    OnEventChange: (e: Event) => void;
    get width(): number;
    get height(): number;
    CreateVoxel(img: HTMLImageElement): void;
    setVoid(coord: number[], isVoid: boolean): void;
    ColorPropagation(): Group[];
    Draw(ctx: CanvasRenderingContext2D, position: Vector2, scale: Vector2): void;
}
