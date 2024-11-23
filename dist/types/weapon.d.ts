import { Player } from "../store/entities";
import { MinWeapon } from "./minimized";
import { Renderable } from "./extenstions";
import { GunData, MeleeData } from "./data";
import { GunColor } from "../constants";
export declare enum WeaponType {
    MELEE = "melee",
    GUN = "gun",
    GRENADE = "grenade"
}
export declare abstract class Weapon implements MinWeapon, Renderable {
    type: WeaponType;
    nameId: string;
    constructor(nameId: string);
    abstract render(player: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare class MeleeWeapon extends Weapon {
    static readonly fistImages: Map<string, HTMLImageElement>;
    type: WeaponType;
    static readonly FIST_ANIMATIONS: string[];
    constructor(nameId: string, _data: MeleeData);
    render(player: Player, _canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare class GunWeapon extends Weapon {
    static readonly barrelImages: Map<string, HTMLImageElement>;
    type: WeaponType;
    color: GunColor;
    length: number;
    hasBarrelImage: boolean;
    magazine: number;
    constructor(nameId: string, data: GunData, magazine?: number);
    render(player: Player, _canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}
export declare abstract class GrenadeWeapon extends Weapon {
    type: WeaponType;
}
export declare class DummyWeapon extends Weapon {
    render(_player: Player, _canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number): void;
}
