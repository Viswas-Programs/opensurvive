import { Entity, Inventory, PartialInventory } from "../../types/entity";
import { MinEntity, MinInventory } from "../../types/minimized";
interface AdditionalEntity {
    id: string;
    username: string;
    boost: number;
    maxBoost: number;
    scope: number;
    inventory: MinInventory | Inventory;
    canInteract?: boolean;
    health: number;
    maxHealth: number;
    reloadTicks: number;
    maxReloadTicks: number;
    healTicks: number;
    maxHealTicks: number;
    skin: string | null;
    deathImg: string | null;
    interactMessage: string | null;
    currentHealItem: string | null;
}
export default class Player extends Entity {
    static readonly TYPE = "player";
    type: string;
    id: string;
    username: string;
    skin: string | null;
    inventory: PartialInventory | Inventory;
    zIndex: number;
    deathImg: string | null;
    currentSkinImg: HTMLImageElement;
    currentDeathImg: HTMLImageElement;
    interactMessage: string | null;
    currentHealItem: string | null;
    pickedAmmo: boolean;
    constructor(minEntity: MinEntity & AdditionalEntity);
    copy(minEntity: MinEntity & AdditionalEntity): void;
    render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare class PartialPlayer extends Player {
    inventory: PartialInventory;
}
export declare class FullPlayer extends Player {
    inventory: Inventory;
    boost: number;
    maxBoost: number;
    scope: number;
    canInteract?: boolean;
    reloadTicks: number;
    maxReloadTicks: number;
    healTicks: number;
    maxHealTicks: number;
    interactMessage: string | null;
    currentHealItem: string | null;
    copy(minEntity: MinEntity & AdditionalEntity): void;
}
export {};
