import * as fs from "fs";
import { clamp, ID } from "../utils";
import { CircleHitbox, Hitbox, Line, RectHitbox, Vec2 } from "./math";
import { Obstacle } from "./obstacle";
import { Weapon } from "./weapon";
import { WEAPON_SUPPLIERS } from "../store/weapons";
import { MinEntity, MinInventory } from "./minimized";
import { CollisionType, CountableString, GunColor } from "./misc";
import { world } from "..";
import { PUSH_THRESHOLD } from "../constants";
import { Player } from "../store/entities";
import { IslandrBitStream } from "../packets";
import { Thing } from "./thing";

export class Inventory {
	// Maximum amount of things.
	static maxAmmos: number[][];
	static maxUtilities: Map<string, number>[];
	static maxHealings: Map<string, number>[];

	holding: number;
	weapons: Weapon[];
	// Indices are colors. Refer to GunColor
	ammos: number[];
	// Utilities. Maps ID to amount of util.
	utilities: CountableString;
	utilOrder = new Set<string>();
	healings: CountableString;
	backpackLevel = 0;
	vestLevel = 0;
	helmetLevel = 0;
	scopes = [1];
	selectedScope = 1;

	constructor(holding: number, weapons?: Weapon[], ammos?: number[], utilities: CountableString = {}, healings: CountableString = {}) {
		this.holding = holding;
		// Hardcoding slots
		this.weapons = weapons || Array(4);
		this.ammos = ammos || Array(Object.keys(GunColor).length / 2).fill(0);
		this.utilities = utilities;
		this.healings = healings;
	}

	static {
		this.maxAmmos = JSON.parse(fs.readFileSync("../data/amount/ammos.json", { encoding: "utf8" }));
		this.maxUtilities = (<any[]>JSON.parse(fs.readFileSync("../data/amount/throwables.json", { encoding: "utf8" }))).map(x => new Map(Object.entries(x)));
		this.maxHealings = (<any[]>JSON.parse(fs.readFileSync("../data/amount/healings.json", { encoding: "utf8" }))).map(x => new Map(Object.entries(x)));
	}

	getWeapon(index = -1) {
		if (index < 0) index = this.holding;
		if (index < this.weapons.length) return this.weapons[index];
		const util = Object.keys(this.utilities)[index - this.weapons.length];
		if (this.utilities[util]) return WEAPON_SUPPLIERS.get(util)!.create();
		return undefined;
	}

	setWeapon(weapon: Weapon, index = -1) {
		if (index < 0) index = this.holding;
		if (index < 3) {this.weapons[index] = weapon; }
	}

	fourthSlot() {
		const util = Array.from(this.utilOrder)[0];
		if (this.utilities[util]) this.weapons[3] = WEAPON_SUPPLIERS.get(util)!.create();
	}

	addScope(scope: number) {
		if (this.scopes.includes(scope)) return false;
		this.scopes.push(scope);
		this.scopes = this.scopes.sort();
		if (this.selectedScope < scope) this.selectScope(scope);
		return true;
	}

	selectScope(scope: number) {
		if (!this.scopes.includes(scope)) return;
		this.selectedScope = scope;
	}

	minimize() {
		return <MinInventory> { holding: this.weapons[this.holding].minimize(), backpackLevel: this.backpackLevel, vestLevel: this.vestLevel, helmetLevel: this.helmetLevel };
		//If the player isn't holding anything no need to minimize it
	}

	static defaultEmptyInventory() {
		const inv = new Inventory(2);
		inv.weapons[2] = WEAPON_SUPPLIERS.get("fists")!.create();
		return inv;
	}
}

export class Entity extends Thing {
	_needToSendAnimations = false
	// If airborne, no effect from terrain
	airborne = false;
	// Tells the client what animation should play
	animations: string[] = [];
	repelExplosions = false;
	// Particle type to emit when damaged
	damageParticle?: string;
	isMobile = false;
	allocBytes = 36;
	goodOldPos = Vec2.ZERO;
	goodOldDirection = Vec2.ZERO;
	surface = "normal";
	readonly actualType = "entity";
	constructor() {
		super(18, "entity");
		// Currently selects a random position to spawn. Will change in the future.
		this.position = this.goodOldPos = world.size.scale(Math.random(), Math.random());
	}

	tick(things: Thing[]) {
		if (!Number.isNaN(this.position.x)) this.goodOldPos = this.position
		if (!Number.isNaN(this.direction.x)) this.goodOldDirection = this.direction
		if (this.animations.length )console.log(this.type, this.animations)
		const lastPosition = this.position;
		// Add the velocity to the position, and cap it at map size.
		if (this.airborne)
			this.position = this.position.addVec(this.velocity);
		else {
			const terrain = world.terrainAtPos(this.position);
			this.position = this.position.addVec(this.velocity.scaleAll(terrain.speed));
			// Also handle terrain damage
			if (terrain.damage != 0 && !(world.ticks % terrain.interval))
				this.damage(terrain.damage);
		}
		this.position = new Vec2(clamp(this.position.x, this.hitbox.comparable, world.size.x - this.hitbox.comparable), clamp(this.position.y, this.hitbox.comparable, world.size.y - this.hitbox.comparable));

		if (this.position != lastPosition) this.markDirty();

		// Check health and maybe call death
		super.tick(things);
	}

	setVelocity(velocity: Vec2) {
		this.velocity = velocity;
		this.markDirty();
	}

	setDirection(direction: Vec2) {
		if (this.isMobile) { this.direction = direction; }
		else { this.direction = direction.unit(); }
		this.markDirty()
	}


	minimize() {
		return Object.assign(super.minimize(), { _needToSendAnimations: this._needToSendAnimations });
	}

	serialise(stream: IslandrBitStream, player: Player) { }
	protected handleCircleCircleCollision(obstacle: Obstacle) {
		const relative = this.position.addVec(obstacle.position.inverse());
		this.position = obstacle.position.addVec(relative.scaleAll((obstacle.hitbox.comparable + this.hitbox.comparable) / relative.magnitude()));
	}

	protected handleCircleRectCenterCollision(obstacle: Obstacle) {
		const rectVecs = [
			new Vec2((<RectHitbox>obstacle.hitbox).width, 0).addAngle(obstacle.direction.angle()),
			new Vec2(0, (<RectHitbox>obstacle.hitbox).height).addAngle(obstacle.direction.angle())
		];
		const centerToCenter = this.position.addVec(obstacle.position.inverse());
		/* In the order of right up left down
		 * Think of the rectangle as vectors
		 *       up vec0
		 *      +------->
		 *      |
		 * left |        right
		 * vec1 |
		 *      v
		 *         down
		 */
		const horiProject = centerToCenter.projectTo(rectVecs[0]);
		const vertProject = centerToCenter.projectTo(rectVecs[1]);
		// Distances between center and each side
		const distances = [
			rectVecs[0].scaleAll(0.5).addVec(horiProject.inverse()),
			rectVecs[1].scaleAll(-0.5).addVec(vertProject.inverse()),
			rectVecs[0].scaleAll(-0.5).addVec(horiProject.inverse()),
			rectVecs[1].scaleAll(0.5).addVec(vertProject.inverse())
		];
		var shortestIndex = 0;
		for (let ii = 1; ii < distances.length; ii++)
			if (distances[ii].magnitudeSqr() < distances[shortestIndex].magnitudeSqr())
				shortestIndex = ii;

		this.position = this.position.addVec(distances[shortestIndex]).addVec(distances[shortestIndex].unit().scaleAll(this.hitbox.comparable));
	}

	protected handleCircleRectPointCollision(obstacle: Obstacle) {
		const rectStartingPoint = obstacle.position.addVec(new Vec2(-(<RectHitbox>obstacle.hitbox).width / 2, -(<RectHitbox>obstacle.hitbox).height / 2).addAngle(obstacle.direction.angle()));
		const rectPoints = [
			rectStartingPoint,
			rectStartingPoint.addVec(new Vec2((<RectHitbox>obstacle.hitbox).width, 0).addAngle(obstacle.direction.angle())),
			rectStartingPoint.addVec(new Vec2((<RectHitbox>obstacle.hitbox).width, (<RectHitbox>obstacle.hitbox).height).addAngle(obstacle.direction.angle())),
			rectStartingPoint.addVec(new Vec2(0, (<RectHitbox>obstacle.hitbox).height).addAngle(obstacle.direction.angle()))
		];
		const intersections = Array(rectPoints.length).fill(false);
		var counts = 0
		for (let ii = 0; ii < rectPoints.length; ii++)
			if (rectPoints[ii].distanceSqrTo(this.position) <= this.hitbox.comparable) {
				intersections[ii] = true;
				counts++;
			}
		if (counts == 2) return this.handleCircleRectLineCollision(obstacle);
		var sum = 0;
		for (let ii = 0; ii < intersections.length; ii++)
			if (intersections[ii])
				sum += ii;
		const index = sum / counts;
		const adjacents = [
			rectPoints[((index - 1) < 0 ? rectPoints.length : index) - 1],
			rectPoints[index],
			rectPoints[(index + 1) % rectPoints.length]
		];
		const vecs = [
			adjacents[1]?.addVec(adjacents[0].inverse()),
			adjacents[2]?.addVec(adjacents[1].inverse())
		];
		if (vecs.some(x => !x)) return;
		for (let ii = 0; ii < vecs.length; ii++) {
			const distance = new Line(adjacents[ii], adjacents[ii+1]).distanceTo(this.position);
			this.position = this.position.addVec(vecs[ii].perpendicular().unit().scaleAll(this.hitbox.comparable - distance));
		}
	}

	protected handleCircleRectLineCollision(obstacle: Obstacle) {
		const rectStartingPoint = obstacle.position.addVec(new Vec2(-(<RectHitbox>obstacle.hitbox).width / 2, -(<RectHitbox>obstacle.hitbox).height / 2).addAngle(obstacle.direction.angle()));
		const rectPoints = [
			rectStartingPoint,
			rectStartingPoint.addVec(new Vec2((<RectHitbox>obstacle.hitbox).width, 0).addAngle(obstacle.direction.angle())),
			rectStartingPoint.addVec(new Vec2((<RectHitbox>obstacle.hitbox).width, (<RectHitbox>obstacle.hitbox).height).addAngle(obstacle.direction.angle())),
			rectStartingPoint.addVec(new Vec2(0, (<RectHitbox>obstacle.hitbox).height).addAngle(obstacle.direction.angle()))
		];
		const distances: number[] = Array(rectPoints.length);
		const vecs: Vec2[] = Array(rectPoints.length);
		for (let ii = 0; ii < rectPoints.length; ii++) {
			const point1 = rectPoints[ii], point2 = rectPoints[(ii + 1) % rectPoints.length];
			vecs[ii] = point2.addVec(point1.inverse());
			distances[ii] = new Line(point1, point2).distanceTo(this.position);
		}
		var shortestIndex = 0;
		for (let ii = 1; ii < distances.length; ii++)
			if (distances[ii] < distances[shortestIndex])
				shortestIndex = ii;
		
		const push = vecs[shortestIndex].perpendicular().unit().scaleAll(this.hitbox.comparable - distances[shortestIndex]);
		if (Math.abs(push.y) < PUSH_THRESHOLD && Math.abs(push.x) < PUSH_THRESHOLD) return;
		this.position = this.position.addVec(push);
	}
}

