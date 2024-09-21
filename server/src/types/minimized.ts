import { IslandrBitStream } from "../packets";

export interface MinVec2 {
	x: number;
	y: number;
}

export interface MinLine {
	a: MinVec2;
	b: MinVec2;
	segment: boolean;
}

export interface MinRectHitbox {
	type: "rect";
	width: number;
	height: number;
}

export interface MinCircleHitbox {
	type: "circle";
	radius: number;
}

export type MinHitbox = MinRectHitbox | MinCircleHitbox;

export class MinEntity {
	id!: string;
	type!: number;
	position!: MinVec2;
	direction!: MinVec2;
	hitbox!: MinHitbox;
	_needsToSendAnimations!: boolean
	animations!: string[];
	despawn!: boolean;
}

export interface MinInventory {
	holding: MinWeapon;
	backpackLevel: number;
	vestLevel: number;
	helmetLevel: number;
}

export interface MinObstacle {
	id: string;
	type: number;
	position: MinVec2;
	direction: MinVec2;
	hitbox: MinHitbox;
	despawn: boolean;
	animations: string[];
	_needToSendAnimations: boolean;
}

export interface MinMinObstacle {
	id: string;
	type: number;
	position: MinVec2;
}

export interface MinWeapon {
	nameId: string;
}

export interface MinParticle {
	id: string;
	position: MinVec2;
	size: number;
}

export interface MinTerrain {
	id: string;
}

export interface MinBuilding {
	id: string;
	position: MinVec2;
	direction: MinVec2;
	zones: { position: MinVec2, hitbox: MinHitbox, map: boolean }[];
	color?: number;
}