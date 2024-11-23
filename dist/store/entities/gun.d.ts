import { GunColor } from "../../constants";
import { Entity } from "../../types/entity";
import { MinEntity } from "../../types/minimized";
import Player from "./player";
interface AdditionalEntity {
    nameId: string;
    color: GunColor;
}
export default class Gun extends Entity {
    static readonly gunImages: Map<string, HTMLImageElement>;
    static readonly TYPE = "gun";
    type: string;
    nameId: string;
    color: GunColor;
    zIndex: number;
    constructor(minEntity: MinEntity & AdditionalEntity);
    copy(minEntity: MinEntity & AdditionalEntity): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
