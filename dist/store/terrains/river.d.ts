import { MinTerrain, MinLine, MinVec2 } from "../../types/minimized";
import { BorderedTerrain } from "../../types/extenstions";
import { LineTerrain, PiecewiseTerrain } from "../../types/terrain";
import { Player } from "../entities";
interface AdditionalSegmentTerrain {
    line: MinLine;
    range: number;
    border: number;
    boundary: MinVec2[];
}
export declare class RiverSegment extends LineTerrain implements BorderedTerrain {
    static readonly ID = "river_segment";
    id: string;
    border: number;
    color: number;
    secondaryColor: number;
    constructor(minTerrain: MinTerrain & AdditionalSegmentTerrain);
    renderLayerN1(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMapLayerN1(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export default class River extends PiecewiseTerrain implements BorderedTerrain {
    static readonly ID = "river";
    id: string;
    border: number;
    color: number;
    secondaryColor: number;
    constructor(minTerrain: MinTerrain & {
        lines: (MinTerrain & AdditionalSegmentTerrain)[];
    });
    renderLayerN1(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMapLayerN1(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
