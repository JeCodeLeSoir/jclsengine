import Vector2 from "./vector2.js";
export declare class Sprite {
    isLoaded: boolean;
    src: string;
    spriteid: number;
    image: HTMLImageElement;
    height: number;
    width: number;
    imageSmoothingEnabled: boolean;
    rects: any[];
    get IsLoad(): boolean;
    LoadJson(fileJson: string, callback?: Function | null): void;
    private LoadImage;
    GetSpriteById(): {
        image: HTMLImageElement;
        rect: any;
    };
}
export declare class SpriteRenderer {
    private _isVisble;
    private _sprite;
    SetSprite(sprite: Sprite): void;
    set isVisible(value: boolean);
    get isVisible(): boolean;
    Draw(ctx: CanvasRenderingContext2D, position: Vector2, rotation: number, size: Vector2): void;
    DrawImageRect(ctx: any, image: any, position: Vector2, size: Vector2, rect: any): void;
}
