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
	ACK = 6,
	GAMEOVER = 7
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
	DROP_WEAPON = 16
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
	BARREL = 21,
	BOX = 22,
	BUSH = 23,
	CRATE = 24,
	DESK = 25,
	DOOR = 26,
	LOG = 27,
	ROOF = 28,
	STONE = 29,
	TABLE = 30,
	TOILET = 31,
	TOILET_MORE = 32,
	TREE = 33,
	WALL = 34,
	SPAWNER = 35
}

export const SkinsDecoding = new Map<number, string>([
	[0, "default"],
	[1, "illuminati"],
	[2, "starstruck"],
	[3, "tulip"],
	[4, "abyssal"],
])

export const SkinsEncoding = new Map<string, number>()
for (let ii = 0; ii < Array.from(SkinsDecoding).length; ii++) {
	SkinsEncoding.set(SkinsDecoding.get(ii)!, ii)
}

export const gunIDsToNum: Map<string, number> = new Map([
	["fists", 0],
	["cqbr", 1],
	["mp9", 2],
	["m18", 3],
	["stf_12", 4],
	["svd-m", 5]
])

export const numToGunIDs = new Map<number, string>()
for (let ii = 0; ii < Array.from(gunIDsToNum).length; ii++) {
	numToGunIDs.set(ii, Array.from(gunIDsToNum)[ii][0])
}
export const DeathImgToNum = new Map<string, number>([
	["Big-Head-Skull", 0],
	["Cartoon-Skull", 1],
	["default", 2],
	["R.I.P", 3],
	["3d-Quality-Skull", 4]
])

export const NumToDeathImg = new Map<number, string>()
for (let ii = 0; ii < Array.from(DeathImgToNum).length; ii++) {
	NumToDeathImg.set(ii, Array.from(DeathImgToNum)[ii][0])
}