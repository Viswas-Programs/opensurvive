import { world } from "../..";
import { CircleHitbox, RectHitbox, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { LOOT_TABLES } from "../../types/loot_table";
import { MapObstacleSupplier, ObstacleSupplier } from "../../types/supplier";
import { MapObstacleData, ObstacleData } from "../../types/data";
import { MAP_OBSTACLE_SUPPLIERS, OBSTACLE_SUPPLIERS } from ".";
import { ObstacleTypes } from "../../constants";

class LogSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new Log(data.special || "stump");
	}
}

class LogMapObstacleSupplier extends MapObstacleSupplier {
	make(data: MapObstacleData) {
		return new Log(data.args ? data.args[0] : "stump");
	}
}

export default class Log extends Obstacle {
	static TYPE = ObstacleTypes.LOG;
	type = Log.TYPE;
	special: string;
	damageParticle = "wood";

	constructor(special = "stump") {
		var hitbox: CircleHitbox;
		var health: number;
		switch (special) {
			case "stump":
				hitbox = new CircleHitbox(1.5);
				health = 100;
				break;
			default:
				hitbox = new CircleHitbox(0.5);
				health = 60;
				break;
		}
		super(world, hitbox, hitbox.scaleAll(0.75), health, health, Vec2.UNIT_X);
		this.special = special;
	}

	static {
		OBSTACLE_SUPPLIERS.set(Log.TYPE, new LogSupplier());
		MAP_OBSTACLE_SUPPLIERS.set(Log.TYPE, new LogMapObstacleSupplier());
	}

	damage(dmg: number) {
		super.damage(dmg);
		//world.onceSounds.push({ path: `obstacles/crate_hit.mp3`, position: this.position });
	}

	die() {
		super.die();
		//world.onceSounds.push({ path: "obstacles/crate_break.mp3", position: this.position });
	}

	minimize() {
		return Object.assign(super.minimize(), { special: this.special });
	}

	minmin() {
		return Object.assign(super.minmin(), { special: this.special });
	}
}