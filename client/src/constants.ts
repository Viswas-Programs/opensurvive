// More like configuration
export enum KeyBind {
	MENU = "Escape",
	HIDE_HUD = "F1",
	WORLD_MAP = "g",
	HIDE_MAP = "z",
	BIG_MAP = "v",
	RIGHT = "d",
	UP = "w",
	LEFT = "a",
	DOWN = "s",
	INTERACT = "f",
	MELEE = "e",
	LAST_USED = "q",
	RELOAD = "r",
	CANCEL = "x"
}
export enum RecvPacketTypes {
	GAME = 0,
	MAP = 1,
	PLAYERTICK = 2,
	SOUND = 3,
	PARTICLES = 4,
	ANNOUNCE = 5,
	SCOPEUPD = 6,
	ACK = 7,
	GAMEOVER = 8
}

export enum OutPacketTypes {
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
export const movementKeys = [KeyBind.RIGHT, KeyBind.UP, KeyBind.LEFT, KeyBind.DOWN].map(k => <string> k);

export const GRID_INTERVAL = 20;
export const MINIMAP_SIZE = 100;
export const TIMEOUT = 10000;
// Translate original surviv.io game units to suit this one
export const GLOBAL_UNIT_MULTIPLIER = 0.5;
// For now we will assume the user uses English
export const LANG = "en_us";

export enum GunColor {
	YELLOW = 0, // 9mm
	RED = 1, // 12 gauge
	BLUE = 2, // 7.62mm
	GREEN = 3, // 5.56mm
	OLIVE = 4, // .308 Subsonic
}
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
	HEALING = 10
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