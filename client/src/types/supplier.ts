import { Entity } from "./entity";
import { MinThing, MinThing, MinParticle, MinTerrain } from "./minimized";
import { Obstacle } from "./obstacle";
import { Particle } from "./particle";
import { Terrain } from "./terrain";
import { Weapon } from "./weapon";

interface Supplier<T> {
	create(...arg: any[]): T;
}

export interface EntitySupplier extends Supplier<Entity> {
	create(minEntity: MinThing  & { [key: string]: any }): Entity;
}

export interface ObstacleSupplier extends Supplier<Obstacle> {
	create(minObstacle: MinThing  & { [key: string]: any }): Obstacle;
}

export interface TerrainSupplier extends Supplier<Terrain> {
	create(minTerrain: MinTerrain  & { [key: string]: any }): Terrain;
}

export interface WeaponSupplier extends Supplier<Weapon> {
	create(...arg: any[]): Weapon;
}

export interface ParticleSupplier extends Supplier<Particle> {
	create(minParticle: MinParticle  & { [key: string]: any }): Particle;
}