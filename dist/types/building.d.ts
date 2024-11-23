import { RenderableMap } from "./extenstions";
import { Hitbox, Vec2 } from "./math";
import { MinBuilding } from "./minimized";
export default class Building implements RenderableMap {
    id: string;
    position: Vec2;
    direction: Vec2;
    zones: {
        position: Vec2;
        hitbox: Hitbox;
        map: boolean;
    }[];
    color?: number;
    constructor(minBuilding: MinBuilding);
    renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
