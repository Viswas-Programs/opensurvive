import { Body, Vector } from "matter-js";
import { Entity } from "../../types/entity";
import { CircleHitbox, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";

export default class Explosion extends Entity {
	type = "explosion";
	exploder: Entity | Obstacle;
	dmg: number;
	minDmg: number;
	radius: number;
	inflation: number;
	damaged = new Set<string>();

	constructor(exploder: Entity | Obstacle, dmg: number, minDmg: number, position: Vector, radius: number, inflation: number, duration: number) {
		super(new CircleHitbox(radius));
		this.exploder = exploder;
		Body.setPosition(this.body, position);
		this.dmg = dmg;
		this.minDmg = minDmg;
		this.radius = radius;
		this.inflation = inflation;
		this.maxHealth = this.health = duration; // ticks
		this.discardable = true;
		this.noCollision = true;
		this.vulnerable = false;
	}

	tick(entities: Entity[], obstacles: Obstacle[]) {
		super.tick(entities, obstacles);

		// Damage to entities and obstacles
		var combined: (Entity | Obstacle)[] = [];
		combined = combined.concat(entities, obstacles);
		for (const thing of combined) {
			if (!this.collided(thing) || this.damaged.has(thing.id)) continue;
			const damage = this.dmg + (this.minDmg - this.dmg) * (this.hitbox.comparable - this.radius) / (this.radius * this.inflation - this.radius);
			thing.damage(damage, this.exploder.id);
			this.damaged.add(thing.id);
		}

		// Inflate the hitbox
		const slope = (this.radius * this.inflation - this.radius) / this.maxHealth;
		// y = mx + radius
		this.hitbox = new CircleHitbox(slope * (this.maxHealth - this.health) + this.radius);
		this.health--;
		if (this.health <= 0) this.die();
	}

	minimize() {
		return Object.assign(super.minimize(), { health: this.health, maxHealth: this.maxHealth });
	}
}