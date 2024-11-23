import { Player } from "../entities";
import { Obstacle } from "../../types/obstacle";
export default class Toilet extends Obstacle {
    static readonly TYPE = "toilet";
    type: string;
    zIndex: number;
    static toiletImg: HTMLImageElement;
    static toiletResidueImg: HTMLImageElement;
    static updateAssets(): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
