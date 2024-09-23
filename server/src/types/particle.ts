import { Vector } from "matter-js";
import { MinParticle } from "./minimized";
import { minimizeVector } from "../utils";

export class Particle {
	id: string;
	position: Vector;
	size: number;

	constructor(id: string, position: Vector, size: number) {
		this.id = id;
		this.position = position;
		this.size = size;
	}

	minimize() {
		return <MinParticle> { id: this.id, position: minimizeVector(this.position), size: this.size };
	}
}