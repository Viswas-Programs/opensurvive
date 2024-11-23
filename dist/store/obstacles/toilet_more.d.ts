import { Player } from "../entities";
import { Obstacle } from "../../types/obstacle";
export default class ToiletMore extends Obstacle {
    static readonly TYPE = "toilet_more";
    type: string;
    zIndex: number;
    static toiletMoreImg: HTMLImageElement;
    static toiletMResidueImg: HTMLImageElement;
    static updateAssets(): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
