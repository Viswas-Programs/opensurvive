import { Vector } from "matter-js";
import { BASE_RADIUS } from "../constants";
import { Player } from "../store/entities";
import Building from "./building";
import { CircleHitbox } from "./math";
import { MinBuilding, MinCircleHitbox, MinMinObstacle, MinThing, MinParticle, MinTerrain, MinVec2 } from "./minimized";
import { MovementDirection } from "./misc";
import { Obstacle } from "./obstacle";
import { Particle } from "./particle";
import { Terrain } from "./terrain";
import { Thing } from "./thing";
import { minimizeVector } from "../utils";

export interface IPacket {
	type: string;
}

export class ResponsePacket implements IPacket {
	type = "response";
	id!: string;
	username!: string;
	skin!: string | null;
	deathImg!: string | null;
	accessToken?: string;
	mode!: string;
	isMobile!: boolean;
}

class PingPacket implements IPacket {
	type = "ping";
}

interface MovementPacket extends IPacket {
	type: string;
	direction: MovementDirection;
}

export class MovementPressPacket implements MovementPacket {
	type = "movementpress";
	direction!: MovementDirection;
}
export class MobileMovementPacket implements IPacket {
	type = "mobilemovement";
	direction!: number;

}
export class PlayerRotationDelta implements IPacket {
	type = "playerRotation";
	angle!: number;
}
export class MovementResetPacket implements IPacket {
	type = "movementReset"
}
export class MovementReleasePacket implements MovementPacket {
	type = "movementrelease";
	direction!: MovementDirection;
}

interface MousePacket extends IPacket {
	type: string;
	button: number;
}

export class MousePressPacket implements MousePacket {
	type = "mousepress";
	button!: number;
}

export class MouseReleasePacket implements MousePacket {
	type = "mouserelease";
	button!: number;
}

export class MouseMovePacket implements IPacket {
	type = "mousemove";
	x!: number;
	y!: number;
}

export class InteractPacket implements IPacket {
	type = "interact";
}

export class SwitchWeaponPacket {
	type = "switchweapon";
	delta!: number;
	setMode!: boolean;
}

export class ReloadWeaponPacket {
	type = "reloadweapon";
}

export class UseHealingPacket {
	type = "usehealing";
	item!: string;
}
export type ClientPacketResolvable = ResponsePacket | PingPacket | MousePressPacket | MouseReleasePacket | MouseMovePacket | MovementPressPacket | MovementReleasePacket | InteractPacket | SwitchWeaponPacket | ReloadWeaponPacket | MovementPacket | MovementResetPacket;

export class AckPacket implements IPacket {
	type = "ack";
	id: string;
	tps: number;
	size: number[];
	terrain: string;

	constructor(id: string, tps: number, size: Vector, terrain: Terrain) {
		this.id = id;
		this.tps = tps;
		this.size = Object.values(size);
		this.terrain = terrain.id;
	}
}

export class GamePacket implements IPacket {
	type = "game";
	things: MinThing[];
	player: Player;
	alivecount: number;
	discards?: string[];
	safeZone?: { hitbox: MinCircleHitbox, position: MinVec2 };
	nextSafeZone?: { hitbox: MinCircleHitbox, position: MinVec2 };

	constructor(things: Thing[], player: Player, alivecount: number, sendAll = false, discards: string[] = []) {
		this.things = (sendAll ? things : things.filter(thing => Vector.magnitudeSquared(Vector.sub(thing.body.position, player.body.position)) < Math.pow(BASE_RADIUS * player.scope, 2))).map(thing => thing.minimize())
		this.player = player;
		this.alivecount = alivecount;
		if (discards.length) this.discards = discards;
	}

	addSafeZoneData(safeZone: { hitbox: CircleHitbox, position: Vector }) {
		this.safeZone = { hitbox: safeZone.hitbox.minimize(), position: minimizeVector(safeZone.position) };
	}

	addNextSafeZoneData(nextSafeZone: { hitbox: CircleHitbox, position: Vector }) {
		this.nextSafeZone = { hitbox: nextSafeZone.hitbox.minimize(), position: minimizeVector(nextSafeZone.position) };
	}
}

export class MapPacket implements IPacket {
	type = "map";
	obstacles: MinMinObstacle[];
	buildings: MinBuilding[];
	terrains: MinTerrain[]

	constructor(things: Thing[], buildings: Building[], terrains: Terrain[]) {
		this.obstacles = things.filter(thing => thing.thingType === "obstacle").map(obstacle => (obstacle as Obstacle).minmin());
		this.buildings = buildings.map(building => building.minimize());
		this.terrains = terrains.map(terrain => terrain.minimize());
	}
}

export class AnnouncePacket implements IPacket {
	type = "announce";
	announcement: string;
	killer: string;

	constructor(announcement: string, killer: string) {
		this.announcement = announcement;
		this.killer = killer;
	}
}

// Let the client handle particles
export class ParticlesPacket implements IPacket {
	type = "particles";
	particles: MinParticle[];

	constructor(particles: Particle[], player: Player) {
		this.particles = particles.filter(particle => Vector.magnitudeSquared(Vector.sub(particle.position, player.body.position)) < Math.pow(BASE_RADIUS * player.scope, 2)).map(particle => particle.minimize());
	}
}

export class SoundPacket implements IPacket {
	type = "sound";
	// No need to include "client/assets/sounds"
	path: string;
	position: Vector;

	constructor(path: string, position: Vector) {
		this.path = path;
		this.position = position;
	}
}