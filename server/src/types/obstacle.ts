import { Body, Vector } from "matter-js";
import { Player } from "../store/entities";
import { Roof } from "../store/obstacles";
import { minimizeVector } from "../utils";
import { Entity } from "./entity";
import { Hitbox, CommonAngles } from "./math";
import { MinMinObstacle } from "./minimized";
import { Thing } from "./thing";
import { World } from "./world";

export class Obstacle extends Thing {
	baseHitbox: Hitbox;
	minHitbox: Hitbox;
	noCollision = false;
	collisionLayers = [-1]; // -1 means on all layers
	vulnerable = true;
	health: number;
	maxHealth: number;
	interactable = false;
	animations: string[] = [];
	// Particle type to emit when damaged
	damageParticle?: string;

	constructor(world: World, baseHitbox: Hitbox, minHitbox: Hitbox, health: number, maxHealth: number, angle?: number) {
		if (baseHitbox.type !== minHitbox.type) throw new Error("Hitboxes are not the same type!");
		super(baseHitbox, "obstacle", angle === undefined ? Math.random() * CommonAngles.TWO_PI : angle);
		this.baseHitbox = this.hitbox = baseHitbox;
		this.minHitbox = minHitbox;
		this.health = health;
		this.maxHealth = maxHealth;
		do {
			Body.setPosition(this.body, Vector.create(world.size.x * Math.random(), world.size.y * Math.random()));
		} while (world.terrainAtPos(this.body.position).id != world.defaultTerrain.id || world.things.find(obstacle => obstacle.thingType === "obstacle" && obstacle.collided(this)) || world.buildings.some(b => b.obstacles.find(o => o.obstacle.type === Roof.ID)?.obstacle.collided(this)));
	}

	damage(dmg: number, damager?: string) {
		if (this.despawn || this.health <= 0 || !this.vulnerable) return;
		this.health -= dmg;
		if (this.health <= 0) this.die(damager);
		this.hitbox = this.baseHitbox.scaleAll(this.minHitbox.comparable / this.baseHitbox.comparable + (this.health / this.maxHealth) * (1 - this.minHitbox.comparable / this.baseHitbox.comparable));
		this.dirty = true;
	}

	die(killer?: string) {
		this.despawn = true;
		this.health = 0;
		this.dirty = true;
	}

	// Hitbox collision check
	/*collided(thing: Entity | Obstacle) {
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
	}*/

	interact(_player: Player) { }

	interactionKey() {
		return this.translationKey();
	}

	translationKey() {
		return `obstacle.${this.type}`;
	}

	// No implementation by default
	onCollision(_thing: Entity | Obstacle) { }

	tick(_entities: Entity[], _obstacles: Obstacle[]) {
		if (this.vulnerable && this.health <= 0 && !this.despawn) this.die();
	}

	rotateAround(pivot: Vector, angle: number) {
		Body.setAngle(this.body, this.body.angle + angle);
		Body.setPosition(this.body, Vector.rotateAbout(this.body.position, angle, pivot));
		this.dirty = true;
	}

	minmin() {
		return <MinMinObstacle>{ id: this.id, type: this.type, position: minimizeVector(this.body.position) };
	}
}