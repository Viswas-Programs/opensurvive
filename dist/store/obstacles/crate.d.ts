import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { Player } from "../entities";
interface AdditionalObstacle {
    special: "normal" | "grenade" | "soviet" | "awc";
}
export default class Crate extends Obstacle {
    static readonly TYPE = "crate";
    type: string;
    special: "normal" | "grenade" | "soviet" | "awc";
    static crateImg: HTMLImageElement;
    static crateResidueImg: HTMLImageElement;
    static grenadeCrateImg: HTMLImageElement;
    static sovietCrateImg: HTMLImageElement;
    static updateAssets(): void;
    copy(minObstacle: MinObstacle & AdditionalObstacle): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
