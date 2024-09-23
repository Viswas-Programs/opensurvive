import { world } from "../..";
import { CircleHitbox } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { LOOT_TABLES } from "../../types/loot_table";
import { ObstacleSupplier } from "../../types/supplier";
import { ObstacleData } from "../../types/data"; 
import { OBSTACLE_SUPPLIERS } from ".";
import { Vector } from "matter-js";

class ToiletMoreSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new ToiletMore();
	}
}
export default class ToiletMore extends Obstacle {
	static readonly TYPE = "toilet_more";
	type = ToiletMore.TYPE;

	constructor() {
		const hitbox = new CircleHitbox(1.2);
		super(world, hitbox, hitbox.scaleAll(0.5), 120, 120);
	}

	static {
		OBSTACLE_SUPPLIERS.set(ToiletMore.TYPE, new ToiletMoreSupplier());
	}

	damage(dmg: number) {
		super.damage(dmg);
		world.onceSounds.push({ path: `obstacles/toilet_hit.mp3`, position: this.body.position });
	}

	die() {
		super.die();
		const entities = LOOT_TABLES.get("toilet_more")?.roll();
		if (entities) {
			world.spawn(...entities.map(e => {
				e.body.position = Vector.clone(this.body.position);
				return e;
			}));
		}
		world.onceSounds.push({ path: `obstacles/toilet_break.mp3`, position: this.body.position });
	}
}