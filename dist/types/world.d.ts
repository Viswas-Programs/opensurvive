import { FullPlayer } from "../store/entities";
import { Entity } from "./entity";
import { CircleHitbox, Vec2 } from "./math";
import { MinCircleHitbox, MinEntity, MinObstacle, MinParticle, MinVec2 } from "./minimized";
import { Obstacle } from "./obstacle";
import { Howl } from "howler";
import Building from "./building";
import { Terrain } from "./terrain";
import { Particle } from "./particle";
export declare class World {
    size: Vec2;
    entities: Entity[];
    obstacles: Obstacle[];
    buildings: Building[];
    particles: Particle[];
    defaultTerrain: Terrain;
    terrains: Terrain[];
    aliveCount: Number;
    sounds: Map<number, {
        howl: Howl;
        pos: Vec2;
    }>;
    safeZone: {
        hitbox: CircleHitbox;
        position: Vec2;
    };
    nextSafeZone: {
        hitbox: CircleHitbox;
        position: Vec2;
    };
    constructor(size: Vec2, defaultTerrain: Terrain);
    clientTick(player: FullPlayer): void;
    updateEntities(entities: MinEntity[], discardEntities?: string[]): void;
    updateObstacles(obstacles: MinObstacle[], discardObstacles?: string[]): void;
    updateLiveCount(count: Number): void;
    updateSafeZone(safeZone: {
        hitbox: MinCircleHitbox;
        position: MinVec2;
    }): void;
    updateNextSafeZone(nextSafeZone: {
        hitbox: MinCircleHitbox;
        position: MinVec2;
    }): void;
    addParticles(minParticles: MinParticle[]): void;
}
