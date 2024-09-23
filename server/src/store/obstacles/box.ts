import { world } from "../..";
import { RectHitbox, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { LOOT_TABLES } from "../../types/loot_table";
import { MapObstacleSupplier, ObstacleSupplier } from "../../types/supplier";
import { MapObstacleData, ObstacleData } from "../../types/data";
import { MAP_OBSTACLE_SUPPLIERS, OBSTACLE_SUPPLIERS } from ".";
import { CollisionLayers, ObstacleTypes } from "../../constants";

class BoxSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new Box();
	}
}

class BoxMapObstacleSupplier extends MapObstacleSupplier {
	make(data: MapObstacleData) {
		return new Box();
	}
}

export default class Box extends Obstacle {
	static readonly TYPE = ObstacleTypes.BOX;
	type = Box.TYPE;
	damageParticle = "wood";

	constructor() {
		var hitbox = new RectHitbox(2, 1.5);
		var health = 80;
		super(world, hitbox, hitbox.scaleAll(0.75), health, health, CollisionLayers.EVERYTHING, Vec2.UNIT_X);
	}

	static {
		OBSTACLE_SUPPLIERS.set(Box.TYPE, new BoxSupplier());
		MAP_OBSTACLE_SUPPLIERS.set(Box.TYPE, new BoxMapObstacleSupplier());
	}

	damage(dmg: number) {
		super.damage(dmg);
		//world.onceSounds.push({ path: `obstacles/crate_hit.mp3`, position: this.position });
	}

	die() {
		super.die();
		var lootTable = "crate";
		const entities = LOOT_TABLES.get(lootTable)?.roll();
		if (entities) {
			world.entities.push(...entities.map(e => {
				e.position = this.position;
				e.setBodies();
				return e;
			}));
		}
		world.onceSounds.push({ path: "obstacles/crate_break.mp3", position: this.position });
	}

	minimize() {
		return Object.assign(super.minimize());
	}

	minmin() {
		return Object.assign(super.minmin());
	}
}