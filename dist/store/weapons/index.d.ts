import { MinWeapon } from "../../types/minimized";
import { WeaponSupplier } from "../../types/supplier";
export declare const WEAPON_SUPPLIERS: Map<string, WeaponSupplier>;
export { default as FragGrenade } from "./grenades/frag_grenade";
export declare function castCorrectWeapon(minWeapon: MinWeapon, magazine?: number): import("../../types/weapon").Weapon;
