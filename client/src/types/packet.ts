import { OutPacketTypes, RecvPacketTypes } from "../constants";
import { IslandrBitStream } from "../packets";
import { Player } from "../store/entities";
import { MinEntity, MinObstacle, MinMinObstacle, MinTerrain, MinVec2, MinBuilding, MinCircleHitbox, MinParticle } from "./minimized";
import { MovementDirection } from "./misc";

export interface IPacket {
	type: number;
}

export class IPacketCLIENT {
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

// Packet to respond the server Ack
export class ResponsePacket extends IPacketCLIENT {
	allocBytes = 25;
	type = OutPacketTypes.RESPONSE;
	id: string;
	username: string;
	skin: number | null;
	deathImg: number | null;
	accessToken?: string;
	isMobile?: boolean;

	constructor(id: string, username: string, skin: number | null, deathImg: number | null, isMobile: boolean, accessToken="") {
		super()
		this.id = id;
		this.username = username;
		this.skin = skin;
		this.deathImg = deathImg;
		this.accessToken = accessToken;
		this.isMobile = isMobile
		this.allocBytes += this.username.length + this.id.length + (this.accessToken?.length as number)
	}
	serialise() {
		super.serialise()
		const stream = this.stream
		stream.writeId(this.id)
		stream.writeUsername(this.username)
		stream.writeInt8(this.skin!)
		stream.writeInt8(this.deathImg!)
		stream.writeAccessToken(this.accessToken as string)
		stream.writeBoolean(this.isMobile as boolean)
	}

}

// Packet to ping the server
export class PingPacket extends IPacketCLIENT {
	type = OutPacketTypes.PING;
	allocBytes = 1
}

// Packet to notify movement key press
export class MovementPressPacket extends IPacketCLIENT {
	type = OutPacketTypes.MOV_PRESS;
	direction: MovementDirection;
	allocBytes = 2;

	constructor(direction: MovementDirection) {
		super()
		this.direction = direction;
	}
	serialise() {
		super.serialise()
		this.stream.writePlayerDirection(this.direction)
	}
}

export class MovementResetPacket extends IPacketCLIENT {
	type = OutPacketTypes.MOV_RESET;
	allocBytes = 1;
}
// Packet to notify movement key release
export class MovementReleasePacket extends IPacketCLIENT {
	type = OutPacketTypes.MOV_REL;
	direction: MovementDirection;
	allocBytes = 2;

	constructor(direction: MovementDirection) {
		super()
		this.direction = direction;
	}
	serialise() {
		super.serialise();
		this.stream.writePlayerDirection(this.direction)
	}
}
export class MovementPacket extends IPacketCLIENT {
	type = OutPacketTypes.MOBILE_MOV;
	allocBytes = 2;
	direction: number;
	constructor(direction: number) {
		super()
		this.direction = direction
	}
	serialise() {
		super.serialise();
		this.stream.writePlayerDirection(this.direction)
	}
}

export class PlayerRotationDelta extends IPacketCLIENT {
	type = OutPacketTypes.PL_ROATION;
	angle: number;
	allocBytes = 2;
	constructor(angle: number) { super(); this.angle = angle }
	serialise() {
		super.serialise();
		this.stream.writePlayerDirection(this.angle)
	}
}
// Packet to notify mouse button press
export class MousePressPacket extends IPacketCLIENT {
	type = OutPacketTypes.MOS_PRESS;
	button: number;
	allocBytes = 2;

	constructor(button: number) {
		super()
		this.button = button;
	}
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.button);
	}
}

// Packet to notify mouse button release
export class MouseReleasePacket extends IPacketCLIENT {
	type = OutPacketTypes.MOS_REL;
	button: number;
	allocBytes = 2;

	constructor(button: number) {
		super()
		this.button = button;
	}
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.button)
	}
}

// Packet to notify mouse movement
export class MouseMovePacket extends IPacketCLIENT {
	type = OutPacketTypes.MOUSEMOVE;
	x: number;
	y: number;
	allocBytes = 5;

	constructor(x: number, y: number) {
		super()
		this.x = x;
		this.y = y;
	}
	serialise() {
		super.serialise();
		this.stream.writeInt16(this.x)
		this.stream.writeInt16(this.y)
	}
}

// Packet to notify interaction (e.g. pickup)
export class InteractPacket extends IPacketCLIENT {
	type = OutPacketTypes.INTERACT;
	allocBytes = 1;
	serialise() {
		super.serialise()
	}
}

// Packet to notify weapon switching
export class DropWeaponPacket extends IPacketCLIENT {
	type = OutPacketTypes.DROP_WEAPON;
	index: number;
	allocBytes = 2;
	constructor(index: number) {
		super()
		this.index=index
	}
	serialise() {
		super.serialise()
		this.stream.writeInt8(this.index)
	}
}
export class SwitchWeaponPacket extends IPacketCLIENT {
	type = OutPacketTypes.SW_WEAPON;
	delta: number;
	setMode: boolean;
	allocBytes = 3;

	constructor(delta: number, setMode = false) {
		super()
		this.delta = delta;
		this.setMode = setMode;
	}
	serialise() {
		super.serialise()
		this.stream.writeInt8(this.delta)
		this.stream.writeBoolean(this.setMode)
	}
}

// Packet to notify weapon reloading
export class ReloadWeaponPacket extends IPacketCLIENT {
	type = OutPacketTypes.REL_WEAPON;
	allocBytes = 1;

	serialise() {
		super.serialise()
	}
}

//notify to cancel any actions going on 
export class CancelActionsPacket extends IPacketCLIENT {
	type = OutPacketTypes.CANCEL_ACT;
	allocBytes = 1;
}

// Packet to notify healing item usage
export class UseHealingPacket extends IPacketCLIENT {
	type = OutPacketTypes.HEAL;
	item: string;
	allocBytes = 16

	constructor(item: string) {
		super()
		this.item = item;
	}
	serialise() {
		super.serialise()
		this.stream.writeHealingItem(this.item)
	}
}

export class ServerScopeUpdatePacket extends IPacketCLIENT {
	type = OutPacketTypes.SR_SCOPE_UPD;
	scope!: number;
	allocBytes = 2;
	constructor(scope: number) {
		super()
		this.scope = scope
	}
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.scope)
	}
}
/// Packet from server acknowledgement
export class AckPacket implements IPacket {
	type = RecvPacketTypes.ACK;
	id!: string;
	tps!: number;
	size!: number[];
	terrain!: MinTerrain;
}

/// Packet from server containing game data
export class GamePacket implements IPacket {
	type = RecvPacketTypes.GAME;
	entities!: MinEntity[];
	obstacles!: MinObstacle[];
	player!: any;
	alivecount!: number;
	discardEntities?: string[];
	discardObstacles?: string[];
	safeZone?: { hitbox: MinCircleHitbox, position: MinVec2 };
	nextSafeZone?: { hitbox: MinCircleHitbox, position: MinVec2 };
}

/// Packet from server containing map data
export class MapPacket implements IPacket {
	type = RecvPacketTypes.MAP;
	obstacles!: MinMinObstacle[];
	buildings!: MinBuilding[];
	terrains!: MinTerrain[];
	maxAmmos!: Array<number[]>;
	maxHealings!: Array<Map<string, number>>;
}

/// Packet from server about sound and its location
export class SoundPacket implements IPacket {
	type = RecvPacketTypes.SOUND;
	path!: string;
	position!: MinVec2;
}

export class ParticlesPacket implements IPacket {
	type = RecvPacketTypes.PARTICLES;
	particles!: MinParticle[];
}

export class AnnouncementPacket implements IPacket {
	type = RecvPacketTypes.ANNOUNCE;
	weaponUsed!: string;
	killer!: string;
	killed!: string;
}
export type ServerPacketResolvable = AckPacket | GamePacket | MapPacket | SoundPacket | ParticlesPacket | AnnouncementPacket;