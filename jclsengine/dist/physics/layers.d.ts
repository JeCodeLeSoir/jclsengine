type Layer = {
    name: string;
    mask: number;
};
export declare class Layers {
    static matrix: boolean[][];
    static _Layers: Map<string, Layer>;
    static GetLayer(name: string): Layer | undefined;
    static AddLayer(name: string, mask: number): void;
    static RemoveLayer(name: string): void;
    static GetMask(name: string): number;
    static LoadLayerCollisionMatrix(csv: any): boolean[][];
    static Load(url: any): void;
}
export {};
