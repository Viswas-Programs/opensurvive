import { Player } from ".";
import { EntityTypes, GLOBAL_UNIT_MULTIPLIER } from "../../constants";
import { IslandrBitStream } from "../../packets";
import { standardEntitySerialiser, writeHitboxes } from "../../serialisers";
import { TracerData } from "../../types/data";
import { Entity } from "../../types/entity";
import { CircleHitbox, Line, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";

export default class Bullet extends Entity {
	type = EntityTypes.BULLET;
	collisionLayers = [0];
	shooter: Entity | Obstacle;
	data: TracerData;
	dmg: number;
	despawning = false;
	falloff: number;
	distanceSqr = 0;

	constructor(shooter: Entity | Obstacle, dmg: number, velocity: Vec2, ticks: number, falloff: number, data: TracerData) {
		super();
		this.hitbox = new CircleHitbox(data.width * GLOBAL_UNIT_MULTIPLIER * 0.5);
		this.shooter = shooter;
		this.data = data;
		this.dmg = dmg;
		this.direction = this.velocity = velocity;
		this.health = this.maxHealth = ticks;
		this.discardable = true;
		this.vulnerable = false;
		this.falloff = falloff;
		this.allocBytes += 44;
	}
	collisionCheck(entities: Entity[], obstacles: Obstacle[]) {
		var combined: (Entity | Obstacle)[] = [];
		combined = combined.concat(entities, obstacles);
		if (!this.despawn)
			for (const thing of combined) {
				if (this.type != thing.type && thing.collided(this)) {
					if (thing.type === EntityTypes.PLAYER && this.shooter.type === EntityTypes.PLAYER) {
					(<any>this.shooter).damageDone += this.dmg;
				}
					thing.damage(this.dmg, this.shooter.id);
					if (thing.surface == "metal") { this.position = this.position.addVec(this.direction.invert()); this.setVelocity(this.direction.invert()); this.direction = this.direction.invert() }
					else if (!thing.noCollision) this.die();
					break;
				}
			}
	}
	tick(entities: Entity[], obstacles: Obstacle[]) {
		const entitiesToCheck = []
		const obstaclesToCheck = []
		for (let ii = 0; ii < entities.length; ii++) {
			if (entities[ii].type != EntityTypes.PLAYER && entities[ii].despawn) continue;
			entitiesToCheck.push(entities[ii])
		}
		for (let ii = 0; ii < obstacles.length; ii++) {
			if (obstacles[ii].type != EntityTypes.PLAYER && obstacles[ii].despawn) continue;
			obstaclesToCheck.push(obstacles[ii])
		}
		const lastPos = this.position;
		super.tick(entities, obstacles);
		this.distanceSqr += this.position.addVec(lastPos.inverse()).magnitudeSqr();
		if (this.distanceSqr >= 10000) this.dmg *= this.falloff;
		this.collisionCheck(entitiesToCheck, obstaclesToCheck);
		// In case the bullet is moving too fast, check for hitbox intersection
		/*if (!this.despawn)
			for (const thing of combined) {
				if (this.type != thing.type && !thing.despawn && thing.hitbox.lineIntersects(new Line(this.position, this.position.addVec(this.velocity)), thing.position, thing.direction)) {
					thing.damage(this.dmg);
					if (!thing.noCollision) this.die();
					break;
				}
			} */

		if (!this.despawn) {
			this.health--;
			if (this.health <= 0) this.die();
		}
	}

	die() {
		super.die();
		// Needs a state marker to determine what particle gets played
		//addParticles(new Particle("blood", this.position));
	}

	minimize() {
		const min = super.minimize();
		return Object.assign(min, { tracer: this.data });
	}
	serialise(stream: IslandrBitStream, player: Player) {
		standardEntitySerialiser(this.minimize(), stream, player)
		stream.writeASCIIString(this.data.type);
		stream.writeFloat64(this.data.length);
		stream.writeFloat64(this.data.width);
		writeHitboxes(this.hitbox.minimize(), stream)
	//write the hitbox configuration
	}
}