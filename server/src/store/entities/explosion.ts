import { Player } from ".";
import { CollisionLayers, EntityTypes } from "../../constants";
import { IslandrBitStream } from "../../packets";
import { standardEntitySerialiser, writeHitboxes } from "../../serialisers";
import { Entity } from "../../types/entity";
import { CircleHitbox, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";

export default class Explosion extends Entity {
	type = EntityTypes.EXPLOSION;
	exploder: Entity | Obstacle;
	dmg: number;
	minDmg: number;
	radius: number;
	inflation: number;
	damaged = new Set<string>();

	constructor(exploder: Entity | Obstacle, dmg: number, minDmg: number, position: Vec2, radius: number, inflation: number, duration: number) {
		super(new CircleHitbox(radius), CollisionLayers.GENERAL);
		this.exploder = exploder;
		this.position = position;
		this.dmg = dmg;
		this.minDmg = minDmg;
		this.radius = radius;
		this.inflation = inflation;
		this.maxHealth = this.health = duration; // ticks
		this.discardable = true;
		this.vulnerable = false;
		this.allocBytes += 11;
		this.setBodies();
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
		this.health-=2;
		if (this.health <= 0) this.die();
	}

	minimize() {
		return Object.assign(super.minimize(), { health: this.health, maxHealth: this.maxHealth });
	}
	serialise(stream: IslandrBitStream, player: Player) {
		standardEntitySerialiser(this.minimize(), stream, player)
		stream.writeInt8(this.health)
		stream.writeInt8(this.maxHealth)
		writeHitboxes(this.hitbox.minimize(), stream)
	//write the hitbox configuration
	}
}
