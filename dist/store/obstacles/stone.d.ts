import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { Player } from "../entities";
interface AdditionObstacle {
    special: "normal" | "ak47";
}
export default class Stone extends Obstacle {
    static readonly TYPE = "stone";
    type: string;
    special: "normal" | "ak47";
    static stoneImg: HTMLImageElement;
    static ak47stoneImg: HTMLImageElement;
    static updateAssets(): void;
    copy(minObstacle: MinObstacle & AdditionObstacle): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
