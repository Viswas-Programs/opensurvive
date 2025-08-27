import { OBSTACLE_SUPPLIERS } from ".";
import { world } from "../..";
import { EntityTypes, ObstacleTypes } from "../../constants";
import { ObstacleData } from "../../types/data";
import { CommonAngles, RectHitbox, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { ObstacleSupplier } from "../../types/supplier";
import { Player } from "../entities";

class DoorSupplier extends ObstacleSupplier {
	make(data: ObstacleData) {
		return new Door(RectHitbox.fromArray(data.hitbox), data.health || 1, Vec2.fromArray(data.pivot));
	}
}

export default class Door extends Obstacle {
	static readonly TYPE = ObstacleTypes.DOOR;
	type = Door.TYPE;
	// Pivot is relative to the center of 
	pivot: Vec2;
	ogPivot: Vec2;
	discardable = true;
	interactable = true;
	opened = false;
	turnedAngle = CommonAngles.PI_TWO

	// We may add a metal type later
	constructor(hitbox: RectHitbox, health: number, pivot: Vec2) {
		super(world, hitbox, hitbox, health, health);
		this.pivot = this.ogPivot= pivot;
	}

	static {
		OBSTACLE_SUPPLIERS.set(Door.TYPE, new DoorSupplier());
	}

	interact(player:Player) {
		if (this.opened) {
			this.position = this.position.addVec(this.pivot).addVec(this.pivot.inverse().addAngle(-this.turnedAngle));
			this.direction = this.direction.addAngle(-this.turnedAngle);
			this.pivot = this.pivot.addAngle(-this.turnedAngle);
			this.opened = false;
		} else {
			if ((player.position.y < this.position.y && (this.ogPivot.x < 0|| this.ogPivot.y < 0)) || (player.position.y > this.position.y && (this.ogPivot.x > 0|| this.ogPivot.y > 0))){
				if ( this.turnedAngle != -CommonAngles.PI_TWO)
					{this.turnedAngle = -CommonAngles.PI_TWO; this.pivot = this.pivot.inverse()}
			}
			else{ if (this.turnedAngle == -CommonAngles.PI_TWO){this.pivot = this.pivot.inverse(); } this.turnedAngle= CommonAngles.PI_TWO;}
			this.position = this.position.addVec(this.pivot).addVec(this.pivot.inverse().addAngle(this.turnedAngle));
			this.direction = this.direction.addAngle(this.turnedAngle);
			this.pivot = this.pivot.addAngle(this.turnedAngle);
			this.opened = true;
		}
		this.markDirty();
	}

	damage(dmg: number, damager?: string): void {
		this.health-= dmg
		this.interact(<Player>(world.entities.find(e => e.id == damager)))
	}

	interactionKey() {
		return `prompt.interact.door.${this.opened ? "close" : "open"}`;
	}
}