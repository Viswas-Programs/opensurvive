import { Entity } from "../../types/entity";
import { MinEntity } from "../../types/minimized";
import Player from "./player";
interface AdditionalEntity {
    level: number;
}
export default class Vest extends Entity {
    static readonly vestImages: HTMLImageElement[];
    static readonly TYPE = "vest";
    type: string;
    level: number;
    zIndex: number;
    constructor(minEntity: MinEntity & AdditionalEntity);
    copy(minEntity: MinEntity & AdditionalEntity): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
