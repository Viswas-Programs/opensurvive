import { OBSTACLE_SUPPLIERS } from ".";
import { world } from "../..";
import { ObstacleTypes } from "../../constants";
import { ObstacleData } from "../../types/data";
import { RectHitbox, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { ObstacleSupplier } from "../../types/supplier";

class WallSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new Wall(RectHitbox.fromArray(data.hitbox), data.health || 1, !!data.health || false, data.color, data.surface);
	}
}

export default class Wall extends Obstacle {
	static readonly TYPE = ObstacleTypes.WALL;
	type = Wall.TYPE;
	// 32-bit RGBA (example: 0xff000077 is red with 0.5 opacity)
	color: number;
	damageParticle = "wood";
	surface = "normal"

	constructor(hitbox: RectHitbox, health: number, vulnerable: boolean, color: number, surface = "normal") {
		super(world, hitbox, hitbox, health, health);
		this.direction = Vec2.UNIT_X;
		this.vulnerable = vulnerable;
		this.color = color;
		this.surface = surface
	}

	static {
		OBSTACLE_SUPPLIERS.set(Wall.TYPE, new WallSupplier());
	}

	minimize() {
		return Object.assign(super.minimize(), { color: this.color });
	}
}