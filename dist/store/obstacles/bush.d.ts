import { Player } from "../entities";
import { Obstacle } from "../../types/obstacle";
export default class Bush extends Obstacle {
    static readonly TYPE = "bush";
    type: string;
    zIndex: number;
    static bushResidueImg: HTMLImageElement;
    static bushImg: HTMLImageElement;
    static updateAssets(): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
