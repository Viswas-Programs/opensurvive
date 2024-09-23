import * as fs from "fs";
import { clamp, equalVec, ID, minimizeVector, vecDistCompare } from "../utils";
import { CircleHitbox, Hitbox, Line, RectHitbox, Vec2 } from "./math";
import { Obstacle } from "./obstacle";
import { Weapon } from "./weapon";
import { WEAPON_SUPPLIERS } from "../store/weapons";
import { MinThing, MinInventory } from "./minimized";
import { CollisionType, CountableString, GunColor } from "./misc";
import { world } from "..";
import { PUSH_THRESHOLD } from "../constants";
import { Player } from "../store/entities";
import { Thing } from "./thing";
import { Body, Vector } from "matter-js";

export class Inventory {
	// Maximum amount of things.
	static maxAmmos: number[][];
	static maxUtilities: Map<string, number>[];
	static maxHealings: Map<string, number>[];

	holding: number;
	weapons: Weapon[];
	// Indices are colors. Refer to GunColor
	ammos: number[];
	// Utilities. Maps ID to amount of util.
	utilities: CountableString;
	utilOrder = new Set<string>();
	healings: CountableString;
	backpackLevel = 0;
	vestLevel = 0;
	helmetLevel = 0;
	scopes = [1];
	selectedScope = 1;

	constructor(holding: number, weapons?: Weapon[], ammos?: number[], utilities: CountableString = {}, healings: CountableString = {}) {
		this.holding = holding;
		// Hardcoding slots
		this.weapons = weapons || Array(4);
		this.ammos = ammos || Array(Object.keys(GunColor).length / 2).fill(0);
		this.utilities = utilities;
		this.healings = healings;
	}

	static {
		this.maxAmmos = JSON.parse(fs.readFileSync("../data/amount/ammos.json", { encoding: "utf8" }));
		this.maxUtilities = (<any[]>JSON.parse(fs.readFileSync("../data/amount/throwables.json", { encoding: "utf8" }))).map(x => new Map(Object.entries(x)));
		this.maxHealings = (<any[]>JSON.parse(fs.readFileSync("../data/amount/healings.json", { encoding: "utf8" }))).map(x => new Map(Object.entries(x)));
	}

	getWeapon(index = -1) {
		if (index < 0) index = this.holding;
		if (index < this.weapons.length) return this.weapons[index];
		const util = Object.keys(this.utilities)[index - this.weapons.length];
		if (this.utilities[util]) return WEAPON_SUPPLIERS.get(util)!.create();
		return undefined;
	}

	setWeapon(weapon: Weapon, index = -1) {
		if (index < 0) index = this.holding;
		if (index < 3) {this.weapons[index] = weapon; }
	}

	fourthSlot() {
		const util = Array.from(this.utilOrder)[0];
		if (this.utilities[util]) this.weapons[3] = WEAPON_SUPPLIERS.get(util)!.create();
	}

	addScope(scope: number) {
		if (this.scopes.includes(scope)) return false;
		this.scopes.push(scope);
		this.scopes = this.scopes.sort();
		if (this.selectedScope < scope) this.selectScope(scope);
		return true;
	}

	selectScope(scope: number) {
		if (!this.scopes.includes(scope)) return;
		this.selectedScope = scope;
	}

	minimize() {
		return <MinInventory> { holding: this.weapons[this.holding].minimize(), backpackLevel: this.backpackLevel, vestLevel: this.vestLevel, helmetLevel: this.helmetLevel };
		//If the player isn't holding anything no need to minimize it
	}

	static defaultEmptyInventory() {
		const inv = new Inventory(2);
		inv.weapons[2] = WEAPON_SUPPLIERS.get("fists")!.create();
		return inv;
	}
}

export class Entity extends Thing {
	velocity: Vector = Vec2.ZERO;
	hitbox: Hitbox = CircleHitbox.ZERO;
	noCollision = false;
	collisionLayers = [-1]; // -1 means on all layers
	vulnerable = true;
	health = 100;
	maxHealth = 100;
	// If airborne, no effect from terrain
	airborne = false;
	interactable = false;
	// Tells the client what animation should play
	animations: string[] = [];
	repelExplosions = false;
	potentialKiller?: string;
	// Particle type to emit when damaged
	damageParticle?: string;
	isMobile = false;

	constructor(hitbox: Hitbox) {
		super(hitbox, "entity");
		// Currently selects a random position to spawn. Will change in the future.
		this.body!.position = Vector.create(world.size.x * Math.random(), world.size.y * Math.random());
	}

	tick(_entities: Entity[], _obstacles: Obstacle[]) {
		const lastPosition = this.body.position;
		// Add the velocity to the position, and cap it at map size.
		if (this.airborne) Body.setVelocity(this.body, this.velocity);
		else {
			const terrain = world.terrainAtPos(this.body.position);
			Body.setVelocity(this.body, Vector.mult(this.velocity, terrain.speed));
			// Also handle terrain damage
			if (terrain.damage != 0 && !(world.ticks % terrain.interval))
				this.damage(terrain.damage);
		}

		if (equalVec(lastPosition, this.body.position)) this.dirty = true;

		// Check health and maybe call death
		if (this.vulnerable && this.health <= 0) this.die();
	}

	setVelocity(velocity: Vector) {
		this.velocity = velocity;
		this.dirty = true;
	}

	// Hitbox collision check
	collided(thing: Entity | Obstacle) {
		if (this.id == thing.id || this.despawn) return CollisionType.NONE;
		if (!this.collisionLayers.includes(-1) && !thing.collisionLayers.includes(-1) && !this.collisionLayers.some(layer => thing.collisionLayers.includes(layer))) return CollisionType.NONE;
		if (vecDistCompare(this.body.position, thing.body.position, this.hitbox.comparable + thing.hitbox.comparable, "gt")) return CollisionType.NONE;
		// For circle it is distance < sum of radii
		// Reason this doesn't require additional checking: Look up 2 lines
		if (this.hitbox.type === "circle" && thing.hitbox.type === "circle") return CollisionType.CIRCLE_CIRCLE;
		else if (this.hitbox.type === "rect" && thing.hitbox.type === "rect") return this.hitbox.collideRect(this.body.position, this.body.angle, <RectHitbox><unknown>thing.hitbox, thing.position, thing.direction);
		else {
			// https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
			// Using the chosen answer
			// EDIT: I don't even know if this is the same answer anymore
			let circle: { hitbox: CircleHitbox, position: Vec2, direction: Vec2 };
			let rect: { hitbox: RectHitbox, position: Vec2, direction: Vec2 };
			if (this.hitbox.type === "circle") {
				circle = { hitbox: <CircleHitbox>this.hitbox, position: this.position, direction: this.direction };
				rect = { hitbox: <RectHitbox>thing.hitbox, position: thing.position, direction: thing.direction };
			} else {
				circle = { hitbox: <CircleHitbox>thing.hitbox, position: thing.position, direction: thing.direction };
				rect = { hitbox: <RectHitbox>this.hitbox, position: this.position, direction: this.direction };
			}
			return rect.hitbox.collideCircle(rect.position, rect.direction, circle.hitbox, circle.position, circle.direction);
		}
	}

	damage(dmg: number, damager?: string) {
		if (!this.vulnerable) return;
		this.health -= dmg;
		this.potentialKiller = damager;
		this.dirty = true;
	}

	die() {
		this.despawn = true;
		this.health = 0;
		this.dirty = true;
	}

	interact(_player: Player) { }

	interactionKey() {
		return this.translationKey();
	}

	translationKey() {
		return `entity.${this.type}`;
	}
}

