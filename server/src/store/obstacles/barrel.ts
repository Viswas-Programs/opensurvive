import { MAP_OBSTACLE_SUPPLIERS, OBSTACLE_SUPPLIERS } from ".";
import { world } from "../..";
import { CircleHitbox, Hitbox } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { MapObstacleSupplier, ObstacleSupplier } from "../../types/supplier";
import Explosion from "../entities/explosion";
import { MapObstacleData, ObstacleData } from "../../types/data";

const _HitboxForVariant = new Map<string, Array<Hitbox>>();
_HitboxForVariant.set("normal", [new CircleHitbox(1.5), new CircleHitbox(0.75)])
_HitboxForVariant.set("dirty", [new CircleHitbox(1.1), new CircleHitbox(0.66)])

class BarrelSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new Barrel(data.special || "normal");
	}
}

class BarrelMapSupplier extends MapObstacleSupplier {
	make(data: MapObstacleData) {
		return new Barrel(data.args ? data.args[0] : "normal");
	}
}

export default class Barrel extends Obstacle {
	static readonly TYPE = "barrel";
	type = Barrel.TYPE;
	surface = "metal"
	special: string;

	constructor(special = "normal") {
		super(world, _HitboxForVariant.get(special)![0], _HitboxForVariant.get(special)![1], 140, 140);
		this.surface = "metal"
		this.special = special
	}

	static {
		OBSTACLE_SUPPLIERS.set(Barrel.TYPE, new BarrelSupplier());
		MAP_OBSTACLE_SUPPLIERS.set(Barrel.TYPE, new BarrelMapSupplier());
	}

	damage(dmg: number) {
		super.damage(dmg);
		world.onceSounds.push({ path: `obstacles/barrel_hit.mp3`, position: this.position });
	}

	die() {
		super.die();
		world.onceSounds.push({ path: `obstacles/barrel_explosion.mp3`, position: this.position });
		world.entities.push(new Explosion(this, 150, 50, this.position, this.hitbox.comparable, 4, 20));
	}
	minimize() {
		const minimizedBarrel = Object.assign(super.minimize(), { special: this.special });
		return minimizedBarrel
		
	}
	minmin() {
		return Object.assign(super.minmin(), {special: this.special})
	}
}