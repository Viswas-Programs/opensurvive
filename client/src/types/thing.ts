import { DEFINED_ANIMATIONS } from "../store/animations";
import { Player } from "../store/entities";
import { Animation } from "./animation";
import { Renderable } from "./extenstions";
import { Vec2, Hitbox, CircleHitbox, RectHitbox } from "./math";
import { MinCircleHitbox, MinRectHitbox, MinThing } from "./minimized";

export abstract class Thing implements Renderable {
	id!: string;
	type!: number;
	position!: Vec2;
	direction!: Vec2;
	hitbox!: Hitbox;
	despawn!: boolean;
	animations: Animation[] = [];
	zIndex = 0;

	constructor(minThing: MinThing) {
		this.copy(minThing);
	}

	copy(minThing: MinThing) {
		this.id = minThing.id;
		this.type = minThing.type;
		this.position = new Vec2(minThing.position.x, minThing.position.y);
		this.direction = new Vec2(minThing.direction.x, minThing.direction.y);
		if (minThing.hitbox.type === "rect") {
			const rect = <MinRectHitbox> minThing.hitbox;
			this.hitbox = new RectHitbox(rect.width, rect.height);
		} else {
			const circle = <MinCircleHitbox> minThing.hitbox;
			this.hitbox = new CircleHitbox(circle.radius);
		}
		this.despawn = minThing.despawn;
		for (const anim of minThing.animations)
			if (DEFINED_ANIMATIONS.has(anim)) {
				const duration = DEFINED_ANIMATIONS.get(anim)!.duration;
				this.animations.push({ id: anim, duration: duration });
			}
	}

	abstract render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;

	renderTick(time: number) {
		const removable: number[] = [];
		for (let ii = 0; ii < this.animations.length; ii++) {
			this.animations[ii].duration -= time;
			if (this.animations[ii].duration <= 0)
				removable.push(ii);
		}
		for (let ii = removable.length - 1; ii >= 0; ii--)
			this.animations.splice(removable[ii], 1);
	}
}