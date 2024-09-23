import { Player } from "../store/entities";
import { ID } from "../utils";
import { Entity } from "./entity";
import { CircleHitbox, Hitbox, RectHitbox, Vec2 } from "./math";
import { MinThing } from "./minimized";
import { CollisionType } from "./misc";
import { Obstacle } from "./obstacle";

export class Thing {
	// identifier
	id: string;
	type: number;
	thingType: "obstacle" | "entity";
	
	// physics
	position: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	direction: Vec2 = Vec2.UNIT_X;
	hitbox: Hitbox = CircleHitbox.ZERO;
	noCollision = false;
	collisionLayers = [-1]; // -1 means on all layers

	// logic
	vulnerable = true;
	health = 100;
	maxHealth = 100;

	// world control
	discardable = false; // If discardable, will be removed from memory when despawn
	despawn = false;
	interactable = false;
	dirty = true;

	// tracking
	potentialKiller?: string;

	// client
	animations: string[] = [];

	constructor(type: number, thingType: "obstacle" | "entity") {
		this.id = ID();
		this.type = type;
		this.thingType = thingType;
	}
	
	collided(thing: Thing) {
		if (this.id == thing.id || this.despawn) return CollisionType.NONE;
		if (!this.collisionLayers.includes(-1) && !thing.collisionLayers.includes(-1) && !this.collisionLayers.some(layer => thing.collisionLayers.includes(layer))) return CollisionType.NONE;
		if (this.position.distanceTo(thing.position) > this.hitbox.comparable + thing.hitbox.comparable) return CollisionType.NONE;
		// For circle it is distance < sum of radii
		// Reason this doesn't require additional checking: Look up 2 lines
		if (this.hitbox.type === "circle" && thing.hitbox.type === "circle") return CollisionType.CIRCLE_CIRCLE;
		else if (this.hitbox.type === "rect" && thing.hitbox.type === "rect") return this.hitbox.collideRect(this.position, this.direction, <RectHitbox><unknown>thing.hitbox, thing.position, thing.direction);
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
		if (this.despawn || this.health <= 0 || !this.vulnerable) return;
		this.health -= dmg;
		this.potentialKiller = damager;
		this.markDirty();
	}

	die() {
		this.despawn = true;
		this.health = 0;
		this.markDirty();
	}

	interact(_player: Player) { }

	interactionKey() {
		return this.translationKey();
	}

	tick(_things: Thing[]) {
		if (this.vulnerable && this.health <= 0 && !this.despawn) this.die();
	}

	translationKey() {
		return `obstacle.${this.type}`;
	}

	markDirty() {
		this.dirty = true;
	}
	
	unmarkDirty() {
		this.dirty = false;
	}

	minimize() {
		return <MinThing> {
			id: this.id,
			type: this.type,
			position: this.position.minimize(),
			direction: this.direction.minimize(),
			hitbox: this.hitbox.minimize(),
			despawn: this.despawn,
			animations: this.animations
		}
	}
}