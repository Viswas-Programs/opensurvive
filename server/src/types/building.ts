import { ID } from "../utils";
import { CircleHitbox, Hitbox, RectHitbox, Vec2 } from "./math";
import { MinBuilding } from "./minimized";
import { Obstacle } from "./obstacle";
import { Terrain } from "./terrain";

export default class Building {
	id: string;
	// Center of the building
	position = Vec2.ZERO;
	direction = Vec2.UNIT_X;
	// "position" here is the relative position of the obstacle towards the center of the building
	obstacles: { obstacle: Obstacle, position: Vec2 }[] = [];
	floors: { terrain: Terrain, position: Vec2 }[] = [];
	zones: { origPos: Vec2, position: Vec2, hitbox: Hitbox, map: boolean }[] = [];
	color?: number;
	zoneHitbox?: CircleHitbox;
	subBuilding?: Building
	zoneHitboxForObstacles?: RectHitbox

	constructor() {
		this.id = ID();
	}

	addZone(position: Vec2, hitbox: Hitbox, map: boolean) {
		this.zones.push({ origPos: position, position: position.addAngle(this.direction.angle()), hitbox, map });
	}

	addObstacle(position: Vec2, obstacle: Obstacle) {
		this.obstacles.push({ obstacle, position });
	}

	addFloor(position: Vec2, terrain: Terrain) {
		this.floors.push({ terrain, position });
	}

	setPosition(position: Vec2) {
		this.position = position;
		for (const ob of this.obstacles) {
			ob.obstacle.position = this.position.addVec(ob.position);
			ob.obstacle.setBodies();
		}
		for (const fl of this.floors) {
			fl.terrain.setPosition(this.position.addVec(fl.position));
		}
		let radiusForZoneHitbox = 15;
		const zoneWidthSizes: number[] = [0]
		const zoneHeightSizes: number[] = [0]
		this.zones.forEach(zone => {
			zoneWidthSizes.push((zone.hitbox as RectHitbox).width)
			zoneHeightSizes.push((zone.hitbox as RectHitbox).height)
			if ((zone.hitbox as RectHitbox).width > (zone.hitbox as RectHitbox).height) {
				radiusForZoneHitbox += (zone.hitbox as RectHitbox).width
			}
			else {
				radiusForZoneHitbox += (zone.hitbox as RectHitbox).height
			}
		})
		const combinedZoneHitboxForObs = new RectHitbox(Math.max(...zoneWidthSizes), Math.max(...zoneHeightSizes))
		this.zoneHitbox = new CircleHitbox(radiusForZoneHitbox)
		this.zoneHitboxForObstacles = combinedZoneHitboxForObs
	}

	setDirection(direction: Vec2) {
		const delta = this.direction.angleBetween(direction);
		this.direction = direction;
		for (const ob of this.obstacles) {
			ob.obstacle.direction = ob.obstacle.direction.addAngle(-delta);
			ob.obstacle.position = this.position.addVec(ob.position.addAngle(delta));
			ob.obstacle.setBodies();
		}
		for (const zone of this.zones) zone.position = zone.origPos.addAngle(this.direction.angle());
		for (const fl of this.floors) {
			fl.terrain.setDirection(this.direction.scaleAll(-1));
			fl.terrain.setPosition(this.position.addVec(fl.position.addAngle(delta)));
		}
	}

	minimize() {
		return <MinBuilding>{
			id: this.id,
			position: this.position.minimize(),
			direction: this.direction.minimize(),
			zones: this.zones.map(zone => ({ position: zone.position.minimize(), hitbox: zone.hitbox.minimize(), map: zone.map })),
			floors: this.floors.map(floor => ({ position: floor.position, terrain: floor.terrain.minimize() })),
			color: this.color
		};
	}
}