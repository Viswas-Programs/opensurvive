import { BASE_RADIUS } from "../constants";
import { IslandrBitStream } from "../packets";
import { calculateAllocBytesForObs, calculateAllocBytesForTickPkt, serialiseDiscardables, serialiseMinObstacles, serialiseMinParticles, serialisePlayer } from "../serialisers";
import { Player } from "../store/entities";
import Building from "./building";
import { Entity } from "./entity";
import { CircleHitbox, Vec2 } from "./math";
import { MinBuilding, MinCircleHitbox, MinMinObstacle, MinObstacle, MinParticle, MinTerrain, MinVec2 } from "./minimized";
import { MovementDirection } from "./misc";
import { Obstacle } from "./obstacle";
import { Particle } from "./particle";
import { Terrain } from "./terrain";

export class  IPacketSERVER {
	type!: string;
	allocBytes!: number;
	stream!: IslandrBitStream;
	serialise() {
	this.stream = IslandrBitStream.alloc(this.allocBytes)
	this.stream.writePacketType(this.type)
	}
	getBuffer() {
		return this.stream.buffer
	}
}
export interface IPacket {
	type: string;
}
export class IPacketCLIENTSERVERCOM {
	type!: string;
	allocBytes!: number;
	stream!: IslandrBitStream
	serialise() {
		this.stream = IslandrBitStream.alloc(this.allocBytes)
		this.stream.writePacketType(this.type)
	}
	deserialise(stream: IslandrBitStream) { }
	getBuffer() {
		return this.stream.buffer
	}
}
export class ResponsePacket extends IPacketCLIENTSERVERCOM {
	type = "response";
	id!: string;
	username!: string;
	skin!: string | null;
	deathImg!: string | null;
	accessToken?: string;
	mode!: string;
	isMobile!: boolean;

	deserialise(stream: IslandrBitStream) {
		this.id = stream.readId()
		this.username = stream.readUsername()
		this.skin = stream.readSkinOrLoadout()
		this.deathImg = stream.readSkinOrLoadout()
		this.accessToken = stream.readAccessToken()
		this.mode = stream.readMode()
		this.isMobile = stream.readBoolean()
	}
}

class PingPacket extends IPacketCLIENTSERVERCOM {
	type = "ping";
	deserialise(stream: IslandrBitStream) { this.type = stream.readPacketType() }
}

class MovementPacket extends IPacketCLIENTSERVERCOM {
	type!: string;
	direction!: MovementDirection;
}

export class MovementPressPacket extends MovementPacket {
	type = "movementpress";
	direction!: MovementDirection;
	deserialise(stream: IslandrBitStream) {
		this.direction = stream.readPlayerDirection()
	}
}
export class MobileMovementPacket extends IPacketCLIENTSERVERCOM {
	type = "mobilemovement";
	direction!: number;
	deserialise(stream: IslandrBitStream) {
		this.direction = stream.readPlayerDirection()
	}

}
export class PlayerRotationDelta extends IPacketCLIENTSERVERCOM {
	type = "playerRotation";
	angle!: number;
	deserialise(stream: IslandrBitStream) {
		this.angle = stream.readPlayerDirection()
	}
}
export class MovementResetPacket extends IPacketCLIENTSERVERCOM {
	type = "movementReset"
}
export class MovementReleasePacket extends MovementPacket {
	type = "movementrelease";
	direction!: MovementDirection;
	deserialise(stream: IslandrBitStream) { this.direction = stream.readPlayerDirection() }
}

class MousePacket extends IPacketCLIENTSERVERCOM {
	type!: string;
	button!: number;
}

export class MousePressPacket extends MousePacket {
	type = "mousepress";
	button!: number;
	deserialise(stream: IslandrBitStream) { this.button = stream.readInt16() }
}

export class MouseReleasePacket extends MousePacket {
	type = "mouserelease";
	button!: number;
	deserialise(stream: IslandrBitStream) { this.button = stream.readInt16() }
}

export class MouseMovePacket extends IPacketCLIENTSERVERCOM {
	type = "mousemove";
	x!: number;
	y!: number;
	deserialise(stream: IslandrBitStream) { this.x = stream.readInt16(); this.y = stream.readInt16(); }
}

export class InteractPacket extends IPacketCLIENTSERVERCOM {
	type = "interact";
}

export class SwitchWeaponPacket {
	type = "switchweapon";
	delta!: number;
	setMode!: boolean;
	deserialise(stream: IslandrBitStream) {
		this.delta = stream.readInt8();
		this.setMode = stream.readBoolean();
	}
}

export class ReloadWeaponPacket {
	type = "reloadweapon";
}

export class CancelActionsPacket {
	type = "cancelAct";
}
export class UseHealingPacket {
	type = "usehealing";
	item!: string;
	deserialise(stream: IslandrBitStream) {
		this.item = stream.readHealingItem()
	}
}
export type ClientPacketResolvable = ResponsePacket | PingPacket | MousePressPacket | MouseReleasePacket | MouseMovePacket | MovementPressPacket | MovementReleasePacket | InteractPacket | SwitchWeaponPacket | ReloadWeaponPacket | MovementPacket | MovementResetPacket | ServerSideScopeUpdate;

export class AckPacket extends IPacketSERVER {
	type = "ack";
	allocBytes = 36;
	id: string;
	tps: number;
	size: number[];
	terrain: string;

	constructor(id: string, tps: number, size: Vec2, terrain: Terrain) {
		super()
		this.id = id;
		this.tps = tps;
		this.size = Object.values(size);
		this.terrain = terrain.id;
	}
	serialise() {
		super.serialise();
		this.stream.writeId(this.id);
		this.stream.writeInt8(this.tps);
		this.stream.writeInt16(this.size[0]); this.stream.writeInt16(this.size[1]);
		this.stream.writeId(this.terrain)
	}
}

export class GamePacket extends IPacketSERVER {
	type = "game";
	allocBytes = 5 + 5;
	entities: Entity[];
	obstacles: MinObstacle[];
	alivecount: number;
	discardEntities?: string[];
	discardObstacles?: string[];
	safeZone?: { hitbox: MinCircleHitbox, position: MinVec2 };
	nextSafeZone?: { hitbox: MinCircleHitbox, position: MinVec2 };
	anyDiscardEntities = false;
	player: Player;
	anyDiscardObstacles = false;
	constructor(entities: Entity[], obstacles: Obstacle[], player: Player, alivecount: number, sendAll = false, discardEntities: string[] = [], discardObstacles: string[] = []) {
		super()
		this.entities = (sendAll ? entities : entities.filter(entity => entity.position.addVec(player.position.inverse()).magnitudeSqr() < Math.pow(BASE_RADIUS * player.scope, 2)));
		this.entities.forEach((entity) => {this.allocBytes += entity.allocBytes})
		this.obstacles = (sendAll ? obstacles : obstacles.filter(obstacle => obstacle.position.addVec(player.position.inverse()).magnitudeSqr() < Math.pow(BASE_RADIUS * player.scope, 2))).map(obstacle => obstacle.minimize());
		this.allocBytes += calculateAllocBytesForObs(obstacles)
		this.alivecount = alivecount;
		this.player = player;
		if (discardEntities.length) { this.discardEntities = discardEntities; this.allocBytes += this.discardEntities.length * 15; this.anyDiscardEntities = true }
		if (discardObstacles.length) { this.discardObstacles = discardObstacles; this.allocBytes += this.discardObstacles.length * 15; this.anyDiscardObstacles=true }
	}
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.entities.length)
		this.entities.forEach(entity => { entity.serialise(this.stream) })
		serialiseMinObstacles(this.obstacles, this.stream)
		this.stream.writeInt8(this.alivecount)
		if (this.anyDiscardEntities) serialiseDiscardables(this.discardEntities as string[], this.stream);
		else {this.stream.writeInt8(0) }
		if (this.anyDiscardObstacles) serialiseDiscardables(this.discardObstacles as string[], this.stream);
		else { this.stream.writeInt8(0) }
	}
}

export class MapPacket implements IPacket {
	type = "map";
	obstacles: MinMinObstacle[];
	buildings: MinBuilding[];
	terrains: MinTerrain[]

	constructor(obstacles: Obstacle[], buildings: Building[], terrains: Terrain[]) {
		this.obstacles = obstacles.map(obstacle => obstacle.minmin());
		this.buildings = buildings.map(building => building.minimize());
		this.terrains = terrains.map(terrain => terrain.minimize());
	}
}
export class PlayerTickPkt extends IPacketSERVER {
	type = "playerTick";
	allocBytes = 11;
	player: Player;
	constructor(player: Player) {
		super();
		this.player = player; 
		this.allocBytes += calculateAllocBytesForTickPkt(this.player)
	}
	serialise() {
		super.serialise();
		serialisePlayer(this.player, this.stream);
}
}
export class AnnouncePacket extends IPacketSERVER {
	type = "announce";
	allocBytes = 94;
	announcement: string;
	killer: string;

	constructor(announcement: string, killer: string) {
		super();
		this.announcement = announcement;
		this.killer = killer;
	}
	serialise() {
		super.serialise();
		this.stream.writeASCIIString(this.announcement, 65)
		this.stream.writeUsername(this.killer)
	}
}

// Let the client handle particles
export class ParticlesPacket extends IPacketSERVER {
	type = "particles";
	allocBytes = 15;
	particles: MinParticle[];

	constructor(particles: Particle[], player: Player) {
		super()
		this.particles = particles.filter(particle => particle.position.addVec(player.position.inverse()).magnitudeSqr() < Math.pow(BASE_RADIUS * player.scope, 2)).map(particle => particle.minimize());
		this.allocBytes += this.particles.length * 35
	}
	serialise() {
		super.serialise();
		serialiseMinParticles(this.particles, this.stream)
	}
}

export class ScopeUpdatePacket extends IPacketSERVER {
	type = "scopeUpdate";
	scope!: number;
	allocBytes = 12+1

	constructor(scope: number) { super(); this.scope = scope }
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.scope)
	}
}

export class ServerSideScopeUpdate extends IPacketCLIENTSERVERCOM {
	type = "srvrScopeUpd";
	scope!: number
	deserialise(stream: IslandrBitStream) {this.scope = stream.readInt8()}
}
export class SoundPacket extends IPacketSERVER {
	type = "sound";
	// No need to include "client/assets/sounds"
	path: string;
	position: Vec2;
	allocBytes = 6+50+4

	constructor(path: string, position: Vec2) {
		super()
		this.path = path;
		this.position = position;
	}
	serialise() {
		super.serialise();
		this.stream.writeASCIIString(this.path, 50);
		this.stream.writeInt16(this.position.x); this.stream.writeInt16(this.position.y)
	}
}