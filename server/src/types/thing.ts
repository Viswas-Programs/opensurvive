import { Bodies, Body, Vector } from "matter-js";
import { ID, minimizeVector } from "../utils";
import { Hitbox, RectHitbox } from "./math";
import { World } from "./world";
import { MinThing } from "./minimized";

// Entity and Obstacle inherit this
export class Thing {
	id: string;
	type = "";
	thingType: "obstacle" | "entity";

	// Physics
	body: Body;
	hitbox: Hitbox;
	layers = [0];
	protected lastPos?: Vector;
	protected lastHitbox?: Hitbox;
	oldBody?: Body;

	// Clients
	animations: string[] = [];

	// Flags
	despawn = false;
	discardable = true;
	dirty = false;

	static createBodyFromHitbox(hitbox: Hitbox, options?: { position?: Vector, angle?: number, isStatic?: boolean }) {
		const pos = options?.position || new Vector();
		const angle = options?.angle || 0;
		if (hitbox.type === "circle") return Bodies.circle(pos.x, pos.y, hitbox.comparable, { isStatic: options?.isStatic, angle });
		else return Bodies.rectangle(pos.x, pos.y, (hitbox as RectHitbox).width, (hitbox as RectHitbox).height, { isStatic: options?.isStatic, angle })
	}

	constructor(hitbox: Hitbox, thingType: "obstacle" | "entity", angle?: number) {
		this.id = ID();
		this.hitbox = hitbox;
		this.thingType = thingType;
		this.body = Thing.createBodyFromHitbox(hitbox, { isStatic: thingType === "obstacle", angle });
	}

	preTick(_world: World) {
	}

	postTick(_world: World) {
		this.lastPos = Vector.clone(this.body.position);

		// Reconstruct body if hitbox changed
		if (this.lastHitbox?.comparable !== this.hitbox.comparable)
			this.body = Thing.createBodyFromHitbox(this.hitbox, { isStatic: this.thingType === "obstacle" });

		this.lastHitbox = Hitbox.clone(this.hitbox);
	}

	setPosition(position: Vector) {
		Body.setPosition(this.body, position);
		this.dirty = true;
	}

	setAngle(angle: number) {
		Body.setAngle(this.body, angle);
		this.dirty = true;
	}

	markDirty() {
		this.dirty = true;
	}

	minimize() {
		return <MinThing> {
			id: this.id,
			type: this.type,
			position: minimizeVector(this.body.position),
			angle: this.body.angle,
			hitbox: this.hitbox.minimize(),
			animations: this.animations,
			despawn: this.despawn
		}
	}
}