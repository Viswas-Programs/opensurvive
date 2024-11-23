import { Entity } from "../../types/entity";
import { MinEntity } from "../../types/minimized";
import Player from "./player";
interface AdditionalEntity {
    health: number;
    maxHealth: number;
}
export default class Explosion extends Entity {
    static readonly TYPE = "explosion";
    type: string;
    constructor(minEntity: MinEntity & AdditionalEntity);
    copy(minEntity: MinEntity & AdditionalEntity): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
