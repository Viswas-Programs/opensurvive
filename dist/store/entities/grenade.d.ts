import { Entity } from "../../types/entity";
import { MinEntity } from "../../types/minimized";
import Player from "./player";
interface AdditionalEntity {
    nameId: string;
}
export default class Grenade extends Entity {
    static readonly grenadeImages: Map<string, HTMLImageElement>;
    static readonly TYPE = "grenade";
    type: string;
    nameId: string;
    zIndex: number;
    constructor(minEntity: MinEntity & AdditionalEntity);
    copy(minEntity: MinEntity & AdditionalEntity): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
