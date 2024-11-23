import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { Player } from "../entities";
export default class Table extends Obstacle {
    static readonly TYPE = "table";
    type: string;
    zIndex: number;
    static tableImg: HTMLImageElement;
    static tableResidueImg: HTMLImageElement;
    static updateAssets(): void;
    copy(minObstacle: MinObstacle): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
