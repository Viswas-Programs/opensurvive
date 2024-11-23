import { Player } from "../store/entities";
import { Hitbox, Vec2 } from "./math";
import { MinEntity, MinInventory } from "./minimized";
import { Renderable } from "./extenstions";
import { Weapon } from "./weapon";
import { Animation } from "./animation";
import { CountableString } from "./misc";
export declare class Inventory {
    helmetLevel: number;
    holding: number;
    weapons: Weapon[];
    slots: number[];
    ammos: number[];
    utilities: CountableString;
    healings: CountableString;
    backpackLevel: number;
    vestLevel: number;
    scopes: number[];
    selectedScope: number;
    constructor(holding: number, slots: number[], weapons?: Weapon[], ammos?: number[], utilities?: CountableString, healings?: CountableString);
    getWeapon(index?: number): Weapon | undefined;
}
export declare class PartialInventory {
    holding: Weapon;
    backpackLevel: number;
    vestLevel: number;
    helmetLevel: number;
    constructor(minInv: MinInventory);
}
export declare abstract class Entity implements Renderable {
    id: string;
    type: string;
    position: Vec2;
    direction: Vec2;
    hitbox: Hitbox;
    animations: Animation[];
    health: number;
    maxHealth: number;
    despawn: boolean;
    zIndex: number;
    constructor(minEntity: MinEntity);
    copy(minEntity: MinEntity): void;
    abstract render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
    renderTick(time: number): void;
}
export declare class DummyEntity extends Entity {
    render(_you: Player, _canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
}
