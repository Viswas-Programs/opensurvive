import { MAP_OBSTACLE_SUPPLIERS, OBSTACLE_SUPPLIERS } from ".";
import { world } from "../..";
import { MapObstacleData, ObstacleData } from "../../types/data";
import { CircleHitbox, Hitbox, RectHitbox } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { MapObstacleSupplier, ObstacleSupplier } from "../../types/supplier";

const _HealthForVariant = new Map<string, number>();
_HealthForVariant.set("normal", 200);
_HealthForVariant.set("pillar", 10000000000000000)
const _HitboxForVariant = new Map<string, Array<Hitbox>>();
_HitboxForVariant.set("normal", [new CircleHitbox(1.5), new CircleHitbox(0.75)])
_HitboxForVariant.set("pillar", [new CircleHitbox(0.888), new CircleHitbox(0.888)])
class StoneSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new Stone(data.special || "normal")
	}
}

class StoneMapSupplier extends MapObstacleSupplier {
	make(data: MapObstacleData) {
		return new Stone(data.args ? data.args[0] : "normal");
	}
}

export default class Stone extends Obstacle {
	static readonly TYPE = "stone";
	type = Stone.TYPE;
	special: string;

	constructor(special = "normal") {
		console.log(_HitboxForVariant.get(special), special)
		super(world, _HitboxForVariant.get(special)![0], _HitboxForVariant.get(special)![1], _HealthForVariant.get(special)!, _HealthForVariant.get(special)!);
		this.special = special;
	}

	static {
		OBSTACLE_SUPPLIERS.set(Stone.TYPE, new StoneSupplier());
		MAP_OBSTACLE_SUPPLIERS.set(Stone.TYPE, new StoneMapSupplier());
	}

	damage(dmg: number) {
		super.damage(dmg);
		//world.onceSounds.push({ path: `obstacles/stone_hit.mp3`, position: this.position });
	}

	die() {
		super.die();
		/*switch (this.special) {
			case "pillar": {
				const ak47 = <GunWeapon>WEAPON_SUPPLIERS.get("mosin_nagant")?.create();
				if (ak47)
					spawnGun(ak47.nameId, ak47.color, this.position, ak47.ammo);
			}
		}*/
		//world.onceSounds.push({ path: `obstacles/stone_break.mp3`, position: this.position });
	}

	minimize() {
		return Object.assign(super.minimize(), { special: this.special });
	}

	minmin() {
		return Object.assign(super.minmin(), { special: this.special });
	}
}