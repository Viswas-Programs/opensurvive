import { Player } from "../entities";
import { Obstacle } from "../../types/obstacle";
import { MinObstacle } from "../../types/minimized";
interface AdditionalObstacle {
    special: "normal" | "mosin";
}
export default class Tree extends Obstacle {
    static readonly TYPE = "tree";
    type: string;
    zIndex: number;
    static treeImg: HTMLImageElement;
    static mosinTreeImg: HTMLImageElement;
    static treeResidueImg: HTMLImageElement;
    special: "normal" | "mosin";
    static updateAssets(): void;
    copy(minObstacle: MinObstacle & AdditionalObstacle): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
