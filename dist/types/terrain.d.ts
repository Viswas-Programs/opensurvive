import { Player } from "../store/entities";
import { Line, Vec2 } from "./math";
import { MinLine, MinTerrain, MinVec2 } from "./minimized";
import { Renderable, RenderableMap } from "./extenstions";
export declare abstract class Terrain implements Renderable, RenderableMap {
    id: string;
    type: string;
    color: number;
    aboveTerrainLine: boolean;
    constructor(minTerrain: MinTerrain);
    colorToHex(color?: number): string;
    setColour(color?: number): Terrain;
    abstract render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    abstract renderMap(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare class FullTerrain extends Terrain {
    render(_you: Player, _canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
}
export declare class DotTerrain extends Terrain {
    type: string;
    position: Vec2;
    radius: number;
    constructor(minTerrain: MinTerrain & {
        position: MinVec2;
        radius: number;
    });
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare class LineTerrain extends Terrain {
    type: string;
    line: Line;
    range: number;
    boundary: {
        start: Vec2;
        end: Vec2;
    };
    constructor(minTerrain: MinTerrain & {
        line: MinLine;
        range: number;
        boundary: MinVec2[];
    });
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare class PiecewiseTerrain extends Terrain {
    type: string;
    lines: LineTerrain[];
    constructor(minTerrain: MinTerrain & {
        lines: (MinTerrain & {
            line: MinLine;
            range: number;
            boundary: MinVec2[];
        })[];
    });
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
