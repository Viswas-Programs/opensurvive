import { ObstacleTypes } from "../../constants";
import { MapObstacleData, ObstacleData } from "../../types/data";
import { MapObstacleSupplier, ObstacleSupplier } from "../../types/supplier";

export const OBSTACLE_SUPPLIERS = new Map<number, ObstacleSupplier>();
export const MAP_OBSTACLE_SUPPLIERS = new Map<number, MapObstacleSupplier>();

export { default as Tree } from "./tree";
export { default as Bush } from "./bush";
export { default as Crate } from "./crate";
export { default as Stone } from "./stone";
export { default as Barrel } from "./barrel";
export { default as Wall } from "./wall";
export { default as Roof } from "./roof";
export { default as Toilet} from "./toilet";
export { default as Spawner } from "./spawner";
export { default as Door } from "./door";
export { default as ToiletMore } from "./toilet_more";
export { default as Table } from "./table";
export { default as Desk } from "./desk";
export { default as Box } from "./box";
export { default as Log } from "./log"

const f: Map<string, number> = new Map([
	["barrel", ObstacleTypes.BARREL],
	["box", ObstacleTypes.BOX],
	["bush", ObstacleTypes.BUSH],
	["crate", ObstacleTypes.CRATE],
	["desk", ObstacleTypes.DESK],
	["door", ObstacleTypes.DOOR],
	["log", ObstacleTypes.LOG],
	["spawner", ObstacleTypes.SPAWNER],
	["stone", ObstacleTypes.STONE],
	["table", ObstacleTypes.TABLE],
	["toilet", ObstacleTypes.TOILET],
	["toilet_more", ObstacleTypes.TOILET_MORE],
	["tree", ObstacleTypes.TREE],
	["wall", ObstacleTypes.WALL],
	["roof", ObstacleTypes.ROOF]
])
export function castObstacle(data: ObstacleData) {
	return OBSTACLE_SUPPLIERS.get(f.get(data.type)!)?.create(data);
}

export function castMapObstacle(data: MapObstacleData) {
	return MAP_OBSTACLE_SUPPLIERS.get(f.get(data.type)!)?.create(data);
}