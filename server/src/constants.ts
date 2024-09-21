import { CommonAngles, Vec2 } from "./types/math";
import * as fs from "fs";

//export const MAP_SIZE = [400, 400];
//small amount of players
export const MAP_SIZE = [200, 200]
export const TICKS_PER_SECOND = 45;
// Radius of 1x scope
export const BASE_RADIUS = 50;
export const DIRECTION_VEC = [Vec2.UNIT_X, Vec2.UNIT_X.addAngle(-CommonAngles.PI_TWO), Vec2.UNIT_X.addAngle(Math.PI), Vec2.UNIT_X.addAngle(CommonAngles.PI_TWO)];
export const PUSH_THRESHOLD = 1e-16;
// Translate original surviv.io game units to suit this one
export const GLOBAL_UNIT_MULTIPLIER = 1;
export const PLAYER_THRESHOLD = 2;

export enum PlayerAnimationTypes { }
export enum OutPacketTypes {
	GAME = 0,
	MAP = 1,
	PLAYERTICK = 2,
	SOUND = 3,
	PARTICLES = 4,
	ANNOUNCE = 5,
	SCOPEUPD = 6,
	ACK = 7
}

export enum RecvPacketTypes {
	RESPONSE = 0,
	PING = 1,
	MOV_PRESS = 2,
	MOV_REL = 3,
	MOV_RESET = 4,
	MOBILE_MOV = 5,
	MOUSEMOVE = 6,
	MOS_PRESS = 7,
	MOS_REL = 8,
	PL_ROATION = 9,
	INTERACT = 10,
	SW_WEAPON = 11,
	REL_WEAPON = 12,
	CANCEL_ACT = 13,
	HEAL = 14,
	SR_SCOPE_UPD = 15,
}
export const TSCONFIG = JSON.parse(fs.readFileSync("./tsconfig.json", { encoding: "utf8" }));

export enum EntityTypes {
	AMMO = 0,
	BACKPACK = 1, 
	BULLET = 2,
	EXPLOSION = 3,
	GRENADE = 4,
	GUN = 5,
	HELMET = 6,
	PLAYER = 7, 
	SCOPE = 8,
	VEST = 9,
	HEALING=10
}

export enum ObstacleTypes {
	BARREL = 1,
	BOX = 2,
	BUSH = 3,
	CRATE = 4,
	DESK = 5,
	DOOR = 6,
	LOG = 7,
	ROOF = 8,
	STONE = 9,
	TABLE = 10,
	TOILET = 11,
	TOILET_MORE = 12,
	TREE = 13,
	WALL = 14
}