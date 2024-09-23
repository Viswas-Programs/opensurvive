import { Body, Vector } from "matter-js";
import { ID, minimizeVector } from "../utils";
import { Hitbox } from "./math";
import { MinBuilding } from "./minimized";
import { Obstacle } from "./obstacle";
import { Terrain } from "./terrain";

export default class Building {
	id: string;
	// Center of the building
	position = new Vector();
	angle = 0;
	// "position" here is the relative position of the obstacle towards the center of the building
	obstacles: { obstacle: Obstacle, position: Vector }[] = [];
	floors: { terrain: Terrain, position: Vector }[] = [];
	zones: { origPos: Vector, position: Vector, hitbox: Hitbox, map: boolean }[] = [];
	color?: number;

	constructor() {
		this.id = ID();
	}

	addZone(position: Vector, hitbox: Hitbox, map: boolean) {
		this.zones.push({ origPos: position, position: Vector.rotate(position, this.angle), hitbox, map });
	}

	addObstacle(position: Vector, obstacle: Obstacle) {
		this.obstacles.push({ position, obstacle });
	}

	addFloor(position: Vector, terrain: Terrain) {
		this.floors.push({ terrain, position });
	}

	setPosition(position: Vector) {
		this.position = position;
		for (const ob of this.obstacles)
			Body.setPosition(ob.obstacle.body, Vector.add(this.position, ob.position));
		for (const fl of this.floors)
			fl.terrain.setPosition(Vector.add(this.position, fl.position));
	}

	setAngle(angle: number) {
		const delta = angle - this.angle;
		this.angle = angle;
		for (const ob of this.obstacles) {
			Body.setAngle(ob.obstacle.body, angle);
			Body.setPosition(ob.obstacle.body, Vector.add(this.position, Vector.rotate(ob.position, delta)));
		}
		for (const zone of this.zones) zone.position = Vector.rotate(zone.origPos, angle);
		for (const fl of this.floors) {
			fl.terrain.setAngle(angle);
			fl.terrain.setPosition(Vector.add(this.position, Vector.rotate(fl.position, delta)));
		}
	}

	minimize() {
		return <MinBuilding>{
			id: this.id,
			position: minimizeVector(this.position),
			angle: this.angle,
			zones: this.zones.map(zone => ({ position: minimizeVector(zone.position), hitbox: zone.hitbox.minimize(), map: zone.map })),
			floors: this.floors.map(floor => ({ position: floor.position, terrain: floor.terrain.minimize() })),
			color: this.color
		};
	}
}