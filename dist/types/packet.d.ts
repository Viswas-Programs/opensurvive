import { MinEntity, MinObstacle, MinMinObstacle, MinTerrain, MinVec2, MinBuilding, MinCircleHitbox, MinParticle } from "./minimized";
import { MovementDirection } from "./misc";
export interface IPacket {
    type: string;
}
export declare class ResponsePacket implements IPacket {
    type: string;
    id: string;
    username: string;
    skin: string | null;
    deathImg: string | null;
    accessToken?: string;
    isMobile?: boolean;
    constructor(id: string, username: string, skin: string | null, deathImg: string | null, isMobile: boolean, accessToken?: string);
}
export declare class PingPacket implements IPacket {
    type: string;
}
export declare class MovementPressPacket implements IPacket {
    type: string;
    direction: MovementDirection;
    constructor(direction: MovementDirection);
}
export declare class MovementResetPacket implements IPacket {
    type: string;
}
export declare class MovementReleasePacket implements IPacket {
    type: string;
    direction: MovementDirection;
    constructor(direction: MovementDirection);
}
export declare class MovementPacket implements IPacket {
    type: string;
    direction: number;
    constructor(direction: number);
}
export declare class PlayerRotationDelta implements IPacket {
    type: string;
    angle: number;
    constructor(angle: number);
}
export declare class MousePressPacket implements IPacket {
    type: string;
    button: number;
    constructor(button: number);
}
export declare class MouseReleasePacket implements IPacket {
    type: string;
    button: number;
    constructor(button: number);
}
export declare class MouseMovePacket implements IPacket {
    type: string;
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class InteractPacket implements IPacket {
    type: string;
}
export declare class SwitchWeaponPacket implements IPacket {
    type: string;
    delta: number;
    setMode: boolean;
    constructor(delta: number, setMode?: boolean);
}
export declare class ReloadWeaponPacket implements IPacket {
    type: string;
}
export declare class CancelActionsPacket implements IPacket {
    type: string;
}
export declare class UseHealingPacket implements IPacket {
    type: string;
    item: string;
    constructor(item: string);
}
export declare class ServerScopeUpdatePacket implements IPacket {
    type: string;
    scope: number;
    constructor(scope: number);
}
export declare class AckPacket implements IPacket {
    type: string;
    id: string;
    tps: number;
    size: number[];
    terrain: MinTerrain;
}
export declare class GamePacket implements IPacket {
    type: string;
    entities: MinEntity[];
    obstacles: MinObstacle[];
    player: any;
    alivecount: number;
    discardEntities?: string[];
    discardObstacles?: string[];
    safeZone?: {
        hitbox: MinCircleHitbox;
        position: MinVec2;
    };
    nextSafeZone?: {
        hitbox: MinCircleHitbox;
        position: MinVec2;
    };
}
export declare class MapPacket implements IPacket {
    type: string;
    obstacles: MinMinObstacle[];
    buildings: MinBuilding[];
    terrains: MinTerrain[];
}
export declare class SoundPacket implements IPacket {
    type: string;
    path: string;
    position: MinVec2;
}
export declare class ParticlesPacket implements IPacket {
    type: string;
    particles: MinParticle[];
}
export declare class AnnouncementPacket implements IPacket {
    type: string;
    announcement: string;
    killer: string;
}
export declare class ScopeUpdatePacket implements IPacket {
    type: string;
    scope: number;
}
export declare class AmmoUpdatePacket implements IPacket {
    type: string;
    ammoToChange: string;
    numberOfAmmo: string;
}
export type ServerPacketResolvable = AckPacket | GamePacket | MapPacket | SoundPacket | ParticlesPacket | AnnouncementPacket | ScopeUpdatePacket | AmmoUpdatePacket;
