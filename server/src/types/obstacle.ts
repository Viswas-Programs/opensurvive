import { Player } from "../store/entities";
import { Roof } from "../store/obstacles";
import { Vec2, Hitbox, CommonAngles } from "./math";
import { MinMinObstacle } from "./minimized";
import { Thing } from "./thing";
import { World } from "./world";

function checkForObsZONEOBSCollision(world: World, position: Vec2): boolean {
	let OBSCollided = false;
	world.buildings.forEach(building => {
		building.floors.forEach(floor => {
			if (floor.terrain.inside(position, true )) OBSCollided = true
		})
	})
	return OBSCollided
}
export class Obstacle extends Thing {
	baseHitbox: Hitbox;
	minHitbox: Hitbox;
	// Particle type to emit when damaged
	damageParticle?: string;
	surface = "normal";
	_needToSendAnimations = false;
	constructor(world: World, baseHitbox: Hitbox, minHitbox: Hitbox, health: number, maxHealth: number, direction?: Vec2) {
		super(19, "obstacle");
		if (baseHitbox.type !== minHitbox.type) throw new Error("Hitboxes are not the same type!");
		this.direction = direction || Vec2.UNIT_X.addAngle(Math.random() * CommonAngles.TWO_PI);
		this.baseHitbox = this.hitbox = baseHitbox;
		this.minHitbox = minHitbox;
		this.health = health;
		this.maxHealth = maxHealth;
		do {
			this.position = world.size.scale(Math.random(), Math.random());
		} while (world.terrainAtPos(this.position).id != world.defaultTerrain.id ||
			world.things.find(obstacle => obstacle.thingType == "obstacle" && obstacle.collided(this)) ||
			world.buildings.some(b => b.obstacles.find(o => o.obstacle.type === Roof.ID)?.obstacle.collided(this)) || 
			checkForObsZONEOBSCollision(world, this.position)
		);
	}

	damage(dmg: number, damager?: string) {
		super.damage(dmg, damager);
		this.hitbox = this.baseHitbox.scaleAll(this.minHitbox.comparable / this.baseHitbox.comparable + (this.health / this.maxHealth) * (1 - this.minHitbox.comparable / this.baseHitbox.comparable));
	}

	// No implementation by default
	onCollision(_thing: Thing) { }

	rotateAround(pivot: Vec2, angle: number) {
		this.direction = this.direction.addAngle(angle);
		this.position = pivot.addVec(this.position.addVec(pivot.inverse()).addAngle(angle));
		this.markDirty();
	}

	minimize() {
		return Object.assign(super.minimize(), { _needToSendAnimations: this._needToSendAnimations });
	}

	minmin() {
		return <MinMinObstacle>{ id: this.id, type: this.type, position: this.position };
	}
}