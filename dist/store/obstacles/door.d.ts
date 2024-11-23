import { RenderableLayerN1 } from "../../types/extenstions";
import { Obstacle } from "../../types/obstacle";
import { Player } from "../entities";
export default class Door extends Obstacle implements RenderableLayerN1 {
    static readonly TYPE = "door";
    type: string;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderLayerN1(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderMap(_canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
}
