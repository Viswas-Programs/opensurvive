import { Player } from "../entities";
import { Obstacle } from "../../types/obstacle";
export default class Barrel extends Obstacle {
    static readonly TYPE = "barrel";
    type: string;
    zIndex: number;
    static barrelImg: HTMLImageElement;
    static barrelResidueImg: HTMLImageElement;
    static updateAssets(): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
