import { Entity } from "../../types/entity";
import { MinEntity } from "../../types/minimized";
import Player from "./player";
interface AdditionalEntity {
    zoom: number;
}
export default class Scope extends Entity {
    static readonly TYPE = "scope";
    type: string;
    zoom: number;
    zIndex: number;
    constructor(minEntity: MinEntity & AdditionalEntity);
    copy(minEntity: MinEntity & AdditionalEntity): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
