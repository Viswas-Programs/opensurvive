import { RenderableLayerN1 } from "../../types/extenstions";
import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { Player } from "../entities";
interface AdditionalObstacle {
    color: number;
}
export default class Wall extends Obstacle implements RenderableLayerN1 {
    static readonly TYPE = "wall";
    type: string;
    color: number;
    zIndex: number;
    copy(minObstacle: MinObstacle & AdditionalObstacle): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderLayerN1(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
}
export {};
