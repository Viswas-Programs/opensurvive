import { TextureData } from "../../types/data";
import { Vec2 } from "../../types/math";
import { MinLine, MinTerrain, MinVec2 } from "../../types/minimized";
import { LineTerrain } from "../../types/terrain";
import { Player } from "../entities";
interface AdditionalFloorTerrain {
    line: MinLine;
    range: number;
    border: number;
    boundary: MinVec2[];
    texture: TextureData;
}
export default class Floor extends LineTerrain {
    static readonly ID = "floor";
    id: string;
    color: number;
    texture: TextureData;
    aboveTerrainLine: boolean;
    textureCache?: HTMLCanvasElement;
    constructor(minTerrain: MinTerrain & AdditionalFloorTerrain);
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    defaultRender(ctx: CanvasRenderingContext2D, dim: Vec2): void;
    renderMap(_canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
}
export {};
