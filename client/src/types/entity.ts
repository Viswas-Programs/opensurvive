import { Player } from "../store/entities";
import { castCorrectWeapon, WEAPON_SUPPLIERS } from "../store/weapons";
import { CircleHitbox, Hitbox, RectHitbox, Vec2 } from "./math";
import { MinCircleHitbox, MinEntity, MinInventory, MinRectHitbox } from "./minimized";
import { Renderable } from "./extenstions";
import {  Weapon } from "./weapon";
import { GunColor } from "../constants";
import { DEFINED_ANIMATIONS } from "../store/animations";
import { Animation } from "./animation";
import { CountableString } from "./misc";
import { getPlayer, getTPS } from "../game";
import { Thing } from "./thing";

export class Inventory {
	helmetLevel !: number
	holding: number;
	weapons: Weapon[];
	// Array of 2 numbers. Order: gun slots, melee slots, grenade slot.
	slots: number[];
	// Indices are colors. Refer to GunColor
	ammos: number[];
	// Utilities. Maps ID to amount of util.
	utilities: CountableString;
	healings: CountableString;
	backpackLevel!: number;
	vestLevel!: number;
	scopes!: number[];
	selectedScope!: number;

	constructor(holding: number, slots: number[], weapons?: Weapon[], ammos?: number[], utilities: CountableString = {}, healings: CountableString = {}) {
		this.holding = holding;
		this.slots = slots;
		this.weapons = weapons || Array(slots.reduce((a, b) => a + b));
		this.ammos = ammos || Array(Object.keys(GunColor).length / 2).fill(0);
		this.utilities = utilities;
		this.healings = healings;
	}

	getWeapon(index = -1) {
		if (index < 0) index = this.holding;
		if (this.holding < this.weapons.length) return this.weapons[this.holding];
		const util = Object.keys(this.utilities)[this.holding - this.weapons.length];
		if (this.utilities[util]) return WEAPON_SUPPLIERS.get(util)!.create();
		return undefined;
	}
}

// Inventory, mainly for players
export class PartialInventory {
	holding: Weapon;
	backpackLevel: number;
	vestLevel: number;
	helmetLevel!: number;

	constructor(minInv: MinInventory) {
		this.holding = castCorrectWeapon(minInv.holding);
		this.backpackLevel = minInv.backpackLevel;
		this.vestLevel = minInv.vestLevel
		this.helmetLevel = minInv.helmetLevel;
	}
}

// An entity with position, velocity and hitbox
export abstract class Entity extends Thing {
	id!: string;
	type!: number;
	position!: Vec2;
	direction!: Vec2;
	hitbox!: Hitbox;
	animations: Animation[] = [];
	health!: number;
	maxHealth!: number;
	despawn!: boolean;
	zIndex = 0;
	oldPos!: Vec2;
	oldDir!: Vec2;
	_lastDirectionChng = Date.now();
	_lastPosChange = Date.now();

	constructor(minEntity: MinEntity) {
		super(minEntity);
	}

	copy(minEntity: MinEntity) {
		super.copy(minEntity);
		if (!this.oldPos) this.oldPos = this.position;
		if (!this.oldDir) this.oldDir = this.direction;
		this.health = this.maxHealth = 100;
	}
}

export class DummyEntity extends Entity {
	render(_you: Player, _canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number) { }
}