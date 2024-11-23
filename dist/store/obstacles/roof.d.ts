import { TextureData } from "../../types/data";
import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { Player } from "../entities";
interface AdditionalObstacle {
    color: number;
    texture?: TextureData;
    roofless: string[];
}
export default class Roof extends Obstacle {
    static readonly ID = "roof";
    type: string;
    color: number;
    roofless: Set<string>;
    texture?: TextureData;
    textureCache?: HTMLCanvasElement;
    zIndex: number;
    opacity: number;
    copy(minObstacle: MinObstacle & AdditionalObstacle): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    defaultRender(ctx: CanvasRenderingContext2D): void;
    renderMap(_canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
}
export {};
