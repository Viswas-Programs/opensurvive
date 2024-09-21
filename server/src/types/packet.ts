import { BASE_RADIUS, OutPacketTypes, RecvPacketTypes } from "../constants";
import { IslandrBitStream } from "../packets";
import { calculateAllocBytesForObs, calculateAllocBytesForTickPkt, serialiseDiscardables, serialiseMinObstacles, serialiseMinParticles, serialisePlayer } from "../serialisers";
import { Player } from "../store/entities";
import Building from "./building";
import { Entity } from "./entity";
import { Vec2 } from "./math";
import { MinBuilding, MinCircleHitbox, MinMinObstacle, MinObstacle, MinParticle, MinTerrain, MinVec2 } from "./minimized";
import { MovementDirection } from "./misc";
import { Obstacle } from "./obstacle";
import { Particle } from "./particle";
import { Terrain } from "./terrain";

export class  IPacketSERVER {
	type!: number;
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
	type: number;
}
export class IPacketCLIENTSERVERCOM {
	type!: number;
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
	type = RecvPacketTypes.RESPONSE;
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
		this.isMobile = stream.readBoolean()
	}
}

class PingPacket extends IPacketCLIENTSERVERCOM {
	type = RecvPacketTypes.PING;
	deserialise(stream: IslandrBitStream) { this.type = stream.readPacketType() }
}

class MovementPacket extends IPacketCLIENTSERVERCOM {
	type!: number;
	direction!: MovementDirection;
}

export class MovementPressPacket extends MovementPacket {
	type = RecvPacketTypes.MOV_PRESS;
	direction!: MovementDirection;
	deserialise(stream: IslandrBitStream) {
		this.direction = stream.readPlayerDirection()
	}
}
export class MobileMovementPacket extends IPacketCLIENTSERVERCOM {
	type = RecvPacketTypes.MOBILE_MOV;
	direction!: number;
	deserialise(stream: IslandrBitStream) {
		this.direction = stream.readPlayerDirection()
	}

}
export class PlayerRotationDelta extends IPacketCLIENTSERVERCOM {
	type = RecvPacketTypes.PL_ROATION;
	angle!: number;
	deserialise(stream: IslandrBitStream) {
		this.angle = stream.readPlayerDirection()
	}
}
export class MovementResetPacket extends IPacketCLIENTSERVERCOM {
	type = RecvPacketTypes.MOV_RESET
}
export class MovementReleasePacket extends MovementPacket {
	type = RecvPacketTypes.MOV_REL;
	direction!: MovementDirection;
	deserialise(stream: IslandrBitStream) { this.direction = stream.readPlayerDirection() }
}

class MousePacket extends IPacketCLIENTSERVERCOM {
	type!: number;
	button!: number;
}

export class MousePressPacket extends MousePacket {
	type = RecvPacketTypes.MOS_PRESS;
	button!: number;
	deserialise(stream: IslandrBitStream) { this.button = stream.readInt8() }
}

export class MouseReleasePacket extends MousePacket {
	type = RecvPacketTypes.MOS_REL;
	button!: number;
	deserialise(stream: IslandrBitStream) { this.button = stream.readInt8() }
}

export class MouseMovePacket extends IPacketCLIENTSERVERCOM {
	type = RecvPacketTypes.MOUSEMOVE;
	x!: number;
	y!: number;
	deserialise(stream: IslandrBitStream) { this.x = stream.readInt16(); this.y = stream.readInt16(); }
}

export class InteractPacket extends IPacketCLIENTSERVERCOM {
	type = RecvPacketTypes.INTERACT;
}

export class SwitchWeaponPacket {
	type = RecvPacketTypes.SW_WEAPON;
	delta!: number;
	setMode!: boolean;
	deserialise(stream: IslandrBitStream) {
		this.delta = stream.readInt8();
		this.setMode = stream.readBoolean();
	}
}

export class ReloadWeaponPacket {
	type = RecvPacketTypes.REL_WEAPON;
}

export class CancelActionsPacket {
	type = RecvPacketTypes.CANCEL_ACT;
}
export class UseHealingPacket {
	type = RecvPacketTypes.HEAL;
	item!: string;
	deserialise(stream: IslandrBitStream) {
		this.item = stream.readHealingItem()
	}
}

export class ServerSideScopeUpdate extends IPacketCLIENTSERVERCOM {
	type = RecvPacketTypes.SR_SCOPE_UPD;
	scope!: number
	deserialise(stream: IslandrBitStream) { this.scope = stream.readInt8() }
}

export type ClientPacketResolvable = ResponsePacket | PingPacket | MousePressPacket | MouseReleasePacket | MouseMovePacket | MovementPressPacket | MovementReleasePacket | InteractPacket | SwitchWeaponPacket | ReloadWeaponPacket | MovementPacket | MovementResetPacket | ServerSideScopeUpdate;

export class AckPacket extends IPacketSERVER {
	type = OutPacketTypes.ACK;
	allocBytes = 8;
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
		this.allocBytes += this.terrain.length + this.id.length
		console.log(this.id)
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
	type = OutPacketTypes.GAME;
	allocBytes = 7;
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
		if (discardEntities.length) { this.discardEntities = discardEntities; this.discardEntities.forEach(discardable => this.allocBytes += (discardable.length+2)); this.anyDiscardEntities = true }
		if (discardObstacles.length) { this.discardObstacles = discardObstacles; this.discardObstacles.forEach(discardable => this.allocBytes += (discardable.length + 2)); this.anyDiscardObstacles=true }
	}
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.entities.length);
		this.entities.forEach(entity => { entity.serialise(this.stream, this.player) });
		serialiseMinObstacles(this.obstacles, this.stream);
		this.stream.writeInt8(this.alivecount);
		if (this.anyDiscardEntities) serialiseDiscardables(this.discardEntities as string[], this.stream);
		else { this.stream.writeInt8(0); }
		if (this.anyDiscardObstacles) serialiseDiscardables(this.discardObstacles as string[], this.stream);
		else { this.stream.writeInt8(0); }
	}
}

export class MapPacket implements IPacket {
	type = OutPacketTypes.MAP;
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
	type = OutPacketTypes.PLAYERTICK;
	allocBytes = 2;
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
	type = OutPacketTypes.ANNOUNCE;
	allocBytes = 1;
	weaponUsed: string;
	killer: string;
	killed: string;

	constructor(weaponUsed: string, killer: string, killed: string) {
		super();
		this.weaponUsed = weaponUsed;
		this.killer = killer;
		this.killed = killed
		this.allocBytes += this.killer.length + 1 + this.killed.length + 1 + this.weaponUsed.length + 1
	}
	serialise() {
		super.serialise();
		this.stream.writeASCIIString(this.weaponUsed)
		this.stream.writeASCIIString(this.killer)
		this.stream.writeASCIIString(this.killed)
	}
}

// Let the client handle particles
export class ParticlesPacket extends IPacketSERVER {
	type = OutPacketTypes.PARTICLES;
	allocBytes = 2;
	particles: MinParticle[];

	constructor(particles: Particle[], player: Player) {
		super()
		this.particles = particles.filter(particle => particle.position.addVec(player.position.inverse()).magnitudeSqr() < Math.pow(BASE_RADIUS * player.scope, 2)).map(particle => particle.minimize());
		this.particles.forEach(particle => {this.allocBytes += particle.id.length+22 })
	}
	serialise() {
		super.serialise();
		serialiseMinParticles(this.particles, this.stream)
	}
}

export class ScopeUpdatePacket extends IPacketSERVER {
	type = OutPacketTypes.SCOPEUPD;
	scope!: number;
	allocBytes = 2

	constructor(scope: number) { super(); this.scope = scope }
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.scope)
	}
}

export class SoundPacket extends IPacketSERVER {
	type = OutPacketTypes.SOUND;
	// No need to include "client/assets/sounds"
	path: string;
	position: Vec2;
	allocBytes = 50+4

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