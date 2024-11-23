import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { Player } from "../entities";
export default class Desk extends Obstacle {
    static readonly TYPE = "desk";
    type: string;
    static deskImg: HTMLImageElement;
    static deskResidueImg: HTMLImageElement;
    static updateAssets(): void;
    copy(minObstacle: MinObstacle): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
