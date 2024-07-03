import { IslandrBitStream } from "../packets";
import { Player } from "../store/entities";
import { MinEntity, MinObstacle, MinMinObstacle, MinTerrain, MinVec2, MinBuilding, MinCircleHitbox, MinParticle } from "./minimized";
import { MovementDirection } from "./misc";

export interface IPacket {
	type: string;
}

export class IPacketCLIENT {
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

// Packet to respond the server Ack
export class ResponsePacket extends IPacketCLIENT {
	allocBytes = 2 + 128;
	type = "response";
	id: string;
	username: string;
	skin: string | null;
	deathImg: string | null;
	accessToken?: string;
	isMobile?: boolean;

	constructor(id: string, username: string, skin: string | null, deathImg: string | null, isMobile: boolean, accessToken?: string) {
		super()
		this.id = id;
		this.username = username;
		this.skin = skin;
		this.deathImg = deathImg;
		this.accessToken = accessToken;
		this.isMobile = isMobile
	}
	serialise() {
		super.serialise()
		const stream = this.stream
		stream.writeId(this.id)
		stream.writeUsername(this.username)
		stream.writeSkinOrLoadout(this.skin as string)
		stream.writeSkinOrLoadout(this.deathImg as string)
		stream.writeAccessToken(this.accessToken as string)
		stream.writeBoolean(this.isMobile as boolean)
	}

}

// Packet to ping the server
export class PingPacket extends IPacketCLIENT {
	type = "ping";
	allocBytes = 2 + 25
}

// Packet to notify movement key press
export class MovementPressPacket extends IPacketCLIENT {
	type = "movementpress";
	direction: MovementDirection;
	allocBytes = 2 + 27;

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
	type = "movementReset";
	allocBytes = 2 + 25;
}
// Packet to notify movement key release
export class MovementReleasePacket extends IPacketCLIENT {
	type = "movementrelease";
	direction: MovementDirection;
	allocBytes = 2 + 25;

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
	type = "mobilemovement"
	allocBytes = 2 + 27;
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
	type = "playerRotation";
	angle: number;
	allocBytes = 2 + 27;
	constructor(angle: number) { super(); this.angle = angle }
	serialise() {
		super.serialise();
		this.stream.writePlayerDirection(this.angle)
	}
}
// Packet to notify mouse button press
export class MousePressPacket extends IPacketCLIENT {
	type = "mousepress";
	button: number;
	allocBytes = 2 + 27;

	constructor(button: number) {
		super()
		this.button = button;
	}
	serialise() {
		super.serialise();
		this.stream.writeInt16(this.button);
	}
}

// Packet to notify mouse button release
export class MouseReleasePacket extends IPacketCLIENT {
	type = "mouserelease";
	button: number;
	allocBytes = 2 + 27;

	constructor(button: number) {
		super()
		this.button = button;
	}
	serialise() {
		super.serialise();
		this.stream.writeInt16(this.button)
	}
}

// Packet to notify mouse movement
export class MouseMovePacket extends IPacketCLIENT {
	type = "mousemove";
	x: number;
	y: number;
	allocBytes = 2 + 33;

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
	type = "interact";
	allocBytes = 2 + 25;
	serialise() {
		super.serialise()
	}
}

// Packet to notify weapon switching
export class SwitchWeaponPacket extends IPacketCLIENT {
	type = "switchweapon";
	delta: number;
	setMode: boolean;
	allocBytes = 2 + 27;

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
	type = "reloadweapon";
	allocBytes = 2 + 25;

	serialise() {
		super.serialise()
	}
}

//notify to cancel any actions going on 
export class CancelActionsPacket extends IPacketCLIENT {
	type = "cancelAct";
	allocBytes = 12;
}

// Packet to notify healing item usage
export class UseHealingPacket extends IPacketCLIENT {
	type = "usehealing";
	item: string;
	allocBytes = 2 + 40

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
	type = "srvrScopeUpd";
	scope!: number;
	allocBytes = 2 + 27;
	constructor(scope: number) {
		super()
		this.scope = scope
	}
	serialise() {
		super.serialise();
		this.stream.writeInt8(this.scope)
	}
}
// Packet to notify interaction (e.g. pickup)

// Packet to notify weapon switching

// Packet to notify weapon reloading

// Packet to notify healing item usage
/// Packet from server acknowledgement
export class AckPacket implements IPacket {
	type = "ack";
	id!: string;
	tps!: number;
	size!: number[];
	terrain!: MinTerrain;
}

/// Packet from server containing game data
export class GamePacket implements IPacket {
	type = "game";
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
	type = "map";
	obstacles!: MinMinObstacle[];
	buildings!: MinBuilding[];
	terrains!: MinTerrain[];
}

/// Packet from server about sound and its location
export class SoundPacket implements IPacket {
	type = "sound";
	path!: string;
	position!: MinVec2;
}

export class ParticlesPacket implements IPacket {
	type = "particles";
	particles!: MinParticle[];
}

export class AnnouncementPacket implements IPacket {
	type = "announce";
	announcement!: string;
	killer!: string;
}

export class ScopeUpdatePacket implements IPacket {
	type = "scopeUpdate";
	scope!: number;

}
export type ServerPacketResolvable = AckPacket | GamePacket | MapPacket | SoundPacket | ParticlesPacket | AnnouncementPacket | ScopeUpdatePacket;