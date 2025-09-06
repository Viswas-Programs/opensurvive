import { MAP_OBSTACLE_SUPPLIERS, OBSTACLE_SUPPLIERS } from ".";
import { world } from "../..";
import { CircleHitbox, Hitbox, RectHitbox } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { MapObstacleSupplier, ObstacleSupplier } from "../../types/supplier";
import { MapObstacleData, ObstacleData } from "../../types/data";
import { ObstacleTypes } from "../../constants";



class Armoury_CageSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new Armoury_Cage();
	}
}

class Armoury_CageMapSupplier extends MapObstacleSupplier {
	make(data: MapObstacleData) {
		return new Armoury_Cage();
	}
}

export default class Armoury_Cage extends Obstacle {
	static readonly TYPE = ObstacleTypes.ARMOURY_CAGE;
	type = Armoury_Cage.TYPE;
	surface = "metal"

	constructor() {
		super(world,new RectHitbox(4, 2), new RectHitbox(3.5, 1.5), 140, 140);
		this.surface = "metal"
	}

	static {
		OBSTACLE_SUPPLIERS.set(Armoury_Cage.TYPE, new Armoury_CageSupplier());
		MAP_OBSTACLE_SUPPLIERS.set(Armoury_Cage.TYPE, new Armoury_CageMapSupplier());
	}

	damage(dmg: number) {
		super.damage(dmg);
		world.onceSounds.push({ path: `obstacles/Armoury_Cage_hit.mp3`, position: this.position });
	}
	minimize() {
		const minimizedArmoury_Cage = Object.assign(super.minimize());
		return minimizedArmoury_Cage
		
	}
	minmin() {
		return Object.assign(super.minmin())
	}
}