import { Player } from "../store/entities";
import { CircleHitbox, Hitbox, RectHitbox, Vec2 } from "./math";
import { MinCircleHitbox, MinObstacle, MinRectHitbox } from "./minimized";
import { Renderable, RenderableMap } from "./extenstions";
import { DEFINED_ANIMATIONS } from "../store/animations";
import { Animation } from "./animation";
import { Thing } from "./thing";

// Obstacles inside the game
export abstract class Obstacle extends Thing implements RenderableMap {
	id!: string;
	type!: number;
	position!: Vec2;
	direction!: Vec2;
	hitbox!: Hitbox;
	despawn!: boolean;
	animations: Animation[] = [];
	zIndex = 0;

	constructor(minObstacle: MinObstacle) {
		super(minObstacle);
	}

	copy(minObstacle: MinObstacle) {
		super.copy(minObstacle);
		if (this.despawn) this.zIndex = 0;
	}

	abstract renderMap(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void;
}

// Dummy obstacle for default casting
export class DummyObstacle extends Obstacle {
	render(_you: Player, _canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number) { }
	renderMap(_canvas: HTMLCanvasElement, _ctx: CanvasRenderingContext2D, _scale: number) { }
}