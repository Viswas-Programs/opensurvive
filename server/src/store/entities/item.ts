import { Vector } from "matter-js";
import { TICKS_PER_SECOND } from "../../constants";
import { Entity } from "../../types/entity";
import { CommonAngles, Hitbox, Vec2 } from "../../types/math";
import { CollisionType } from "../../types/misc";
import { Obstacle } from "../../types/obstacle";
import Player from "./player";

export default abstract class Item extends Entity {
	type = "item";
	discardable = true;
	interactable = true;
	friction = 0.02; // frictional acceleration, not force
	collisionLayers = [1];
	repelExplosions = true;

	constructor(hitbox: Hitbox) {
		super(hitbox);
		this.randomVelocity();
		this.discardable = true;
		this.noCollision = true;
		this.vulnerable = false;
	}

	// Terrible name lol
	randomVelocity(direction = new Vector()) {
		if (Vector.magnitudeSquared(direction) != 0) this.velocity = Vector.mult(Vector.normalise(direction), 0.01);
		else this.velocity = Vector.mult(Vector.rotate(Vector.create(1, 0), Math.random() * CommonAngles.TWO_PI), 0.01);
		this.markDirty();
	}

	tick(entities: Entity[], obstacles: Obstacle[]) {
		super.tick(entities, obstacles);
		var colliding = false;
		/*for (const entity of entities.filter(e => e.id != this.id)) {
			if (this.collided(entity)) {
				const movement = this.position.addVec(entity.position.inverse());
				// Avoid doing sqrt more than once
				const mag = movement.magnitude();
				const safeDistance = this.hitbox.comparable + entity.hitbox.comparable;
				this.setVelocity(this.velocity.addVec(movement.scaleAll(((safeDistance - mag) / safeDistance) / (mag * TICKS_PER_SECOND * 20))));
				colliding = true;
			}
		}*/
		if (!colliding) this.setVelocity(Vector.mult(this.velocity, 1 - this.friction));
		/*for (const obstacle of obstacles) {
			const collisionType = obstacle.collided(this);
			if (collisionType) {
				obstacle.onCollision(this);
				if (!obstacle.noCollision) {
					const oldPosition = this.position;
					if (collisionType == CollisionType.CIRCLE_CIRCLE) this.handleCircleCircleCollision(obstacle);
					else if (collisionType == CollisionType.CIRCLE_RECT_CENTER_INSIDE) this.handleCircleRectCenterCollision(obstacle);
					else if (collisionType == CollisionType.CIRCLE_RECT_POINT_INSIDE) this.handleCircleRectPointCollision(obstacle);
					else if (collisionType == CollisionType.CIRCLE_RECT_LINE_INSIDE) this.handleCircleRectLineCollision(obstacle);
					// Avoid glitchy movements
					if (this.position.x == oldPosition.x) this.velocity = this.velocity.scale(0, 1);
					if (this.position.y == oldPosition.y) this.velocity = this.velocity.scale(1, 0);
					this.markDirty();
				}
			}
		}*/
	}

	interact(player: Player) {
		if (this.picked(player)) {
			this.die();
			player.markDirty();
		}
	}

	interactionKey() {
		return `prompt.pickup ${this.translationKey()}`;
	}

	abstract picked(player: Player): boolean;
}