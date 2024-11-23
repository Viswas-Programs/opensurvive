import { Player } from ".";
import { Entity } from "../../types/entity";
import { MinEntity } from "../../types/minimized";
interface AdditionalEntity {
    nameId: string;
}
export default class Healing extends Entity {
    static readonly healingImages: Map<string, HTMLImageElement>;
    static mapping: string[];
    static readonly TYPE = "healing";
    type: string;
    nameId: string;
    zIndex: number;
    constructor(minEntity: MinEntity & AdditionalEntity);
    static setupHud(): Promise<void>;
    copy(minEntity: MinEntity & AdditionalEntity): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export {};
