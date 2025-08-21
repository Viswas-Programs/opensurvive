import { MAP_TERRAIN_SUPPLIERS } from ".";
import { world } from "../..";
import { MapTerrainData } from "../../types/data";
import { Vec2, Line } from "../../types/math";
import { MapTerrainSupplier } from "../../types/supplier";
import { LineTerrain } from "../../types/terrain";

class BeachMapSupplier extends MapTerrainSupplier {
	make(data: MapTerrainData) {
		let positions: Array<Vec2>=  []
		if (!data.args![2]){
			positions = [Vec2.ZERO, new Vec2(world.size.x, 0), new Vec2(world.size.x, world.size.y), new Vec2(0, world.size.y)];
		}
		else{ for (let ii=0; ii<data.args![2].length; ii++){positions.push(Vec2.fromArray(data.args![2][ii]))}}
		return new Beach(data.args![0], data.args![1], positions);
	}
}

export default class Beach extends LineTerrain {
	static readonly ID = "beach";
	id = Beach.ID;
	border = 0;

	// 0-3: top, right, bottom, left
	constructor(side: number, range: number, referencePositions: Array<Vec2>) {
		const points = referencePositions;
		super(1, 0, 0, new Line(points[side], points[(side + 1) % points.length]), range);
	}

	static {
		MAP_TERRAIN_SUPPLIERS.set(Beach.ID, new BeachMapSupplier());
	}
}

class SlDarkBeachMapSupplier extends MapTerrainSupplier {
	make(data: MapTerrainData) {
		let positions: Array<Vec2>=  []
		if (!data.args![2]){
			positions = [Vec2.ZERO, new Vec2(world.size.x, 0), new Vec2(world.size.x, world.size.y), new Vec2(0, world.size.y)];
		}
		else{ for (let ii=0; ii<data.args![2].length; ii++){positions.push(Vec2.fromArray(data.args![2][ii]))}}
		return new SlDarkBeach(data.args![0], data.args![1], positions);
	}
}

export class SlDarkBeach extends Beach{
	static id = "sldarkbeach"
	id = SlDarkBeach.id
	static {
		MAP_TERRAIN_SUPPLIERS.set(SlDarkBeach.id, new SlDarkBeachMapSupplier())
	}
}

class DarkBeachMapSupplier extends MapTerrainSupplier {
	make(data: MapTerrainData) {
		let positions: Array<Vec2>=  []
		if (!data.args![2]){
			positions = [Vec2.ZERO, new Vec2(world.size.x, 0), new Vec2(world.size.x, world.size.y), new Vec2(0, world.size.y)];
		}
		else{ for (let ii=0; ii<data.args![2].length; ii++){positions.push(Vec2.fromArray(data.args![2][ii]))}}
		return new DarkBeach(data.args![0], data.args![1], positions);
	}
}

export class DarkBeach extends Beach{
	static id= "darkbeach"
	id= DarkBeach.id
	static { 
		MAP_TERRAIN_SUPPLIERS.set(DarkBeach.id, new DarkBeachMapSupplier())
	}
}