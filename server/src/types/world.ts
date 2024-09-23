import * as fs from "fs";
import Building from "./building";
import { RedZoneDataEntry } from "./data";
import { CircleHitbox, Vec2 } from "./math";
import { Particle } from "./particle";
import { LAYERS, PLAYER_THRESHOLD, TICKS_PER_SECOND } from "../constants";
import { Player } from "../store/entities";
import { Terrain } from "./terrain";
import { reset } from "..";
import { Thing } from "./thing";
import { Composite, Engine, Runner, Vector } from "matter-js";
import { clamp } from "../utils";
import Matter = require("matter-js");

Matter.use()

const RUNNER = Runner.create({ delta: 1000 / TICKS_PER_SECOND, isFixed: true, enabled: true }); // Matter.js runner

export class World {
	ticks = 0;
	engines: Engine[] = [];
	size: Vector;
	things: Thing[] = [];
	discards: string[] = [];
	dirtys: Thing[] = [];
	buildings: Building[] = [];
	defaultTerrain: Terrain;
	terrains: Terrain[] = [];
	private lastTickTime = 0;
	playerCount = 0;

	// Red zone stuff
	private zoneActive = false;
	private zoneData: RedZoneDataEntry[];
	private zoneStep = 0;
	zoneMoving = false;
	private zoneTick: number;
	zoneDamage: number;
	nextSafeZone: { hitbox: CircleHitbox; position: Vector; };
	safeZone: { hitbox: CircleHitbox; oHitbox: CircleHitbox; position: Vector; oPosition: Vector; };

	// These should be sent once only to the client
	particles: Particle[] = [];
	onceSounds: { path: string; position: Vector; }[] = []; // Sent when stuff happens, e.g. effect sounds
	joinSounds: { path: string; position: Vector; }[] = []; // Sent when player joins, e.g. music

	//Kill feed storage
	killFeeds: { killFeed: string; killer: string; }[] = [];
	constructor(size: Vec2, defaultTerrain: Terrain) {
		// Create or the engine layers
		for (let ii = 0; ii < LAYERS; ii++)
			this.engines.push(Engine.create({ gravity: { y: 0 } }));

		// Set the size of map
		this.size = size;

		// Set the terrains
		this.defaultTerrain = defaultTerrain;

		// Red zone init
		this.zoneData = <RedZoneDataEntry[]>JSON.parse(fs.readFileSync("../data/config/red_zone.json", { encoding: "utf8" }));
		this.zoneTick = this.zoneData[this.zoneStep].wait * TICKS_PER_SECOND;
		this.zoneDamage = this.zoneData[this.zoneStep].damage;

		this.safeZone = {
			hitbox: new CircleHitbox(Vector.magnitude(this.size) * 0.5),
			oHitbox: new CircleHitbox(Vector.magnitude(this.size) * 0.5),
			position: Vector.mult(this.size, 0.5),
			oPosition: Vector.mult(this.size, 0.5)
		};
		this.nextSafeZone = this.safeZone;
	}

	addPlayer(player: Player) {
		this.playerCount++;
		this.things.push(player);
		if (!this.zoneActive && this.playerCount >= PLAYER_THRESHOLD) {
			this.zoneActive = true;
			console.log("Red zone is now active");
		}
	}

	playerDied() {
		this.playerCount = this.things.filter(entity => entity.type === "player" && !entity.despawn).length;
		if (this.zoneActive || this.zoneTick > 0) return;
		if (!this.playerCount) {
			console.log("All players have died. Resetting game...");
			reset();
		}
	}

	terrainAtPos(position: Vector) {
		// Loop from last to first
		for (let ii = this.terrains.length - 1; ii >= 0; ii--) {
			const terrain = this.terrains[ii];
			if (terrain.inside(position)) return terrain;
		}
		return this.defaultTerrain;
	}

	tick() {
		this.ticks++;
		// Merge obstacles

		this.things.forEach(thing => thing.preTick(this));
		this.engines.forEach(engine => Engine.update(engine, this.lastTickTime ? Date.now() - this.lastTickTime : 0));
		if (!this.lastTickTime) this.lastTickTime = Date.now();
		let removable: number[] = [];
		this.things.forEach((thing, ii) => {
			thing.postTick(this);
			if (thing.despawn && thing.discardable) {
				removable.push(ii);
				this.discards.push(thing.id);
				for (const layer of thing.layers)
					Composite.remove(this.engines[layer].world, thing.body);
			} else if (thing.dirty) {
				thing.dirty = false;
				this.dirtys.push(thing);
			} else if (thing.oldBody) {
				for (const layer of thing.layers) {
					Composite.remove(this.engines[layer].world, thing.oldBody);
					Composite.add(this.engines[layer].world, thing.body);
				}
				thing.oldBody = undefined;
			}
		});

		// Tick red zone
		if (this.zoneActive) {
			this.zoneTick--;
			if (!this.zoneTick) {
				this.zoneMoving = !this.zoneMoving;
				if (this.zoneMoving) this.zoneTick = this.zoneData[this.zoneStep].move * TICKS_PER_SECOND;
				else {
					this.zoneStep++;
					if (!this.zoneData[this.zoneStep]) {
						this.zoneActive = false;
						this.zoneTick = 0;
						this.playerDied();
					} else {
						this.safeZone.oPosition = this.safeZone.position;
						this.safeZone.oHitbox = this.safeZone.hitbox;
						const positions = this.things.filter(thing => thing.type === "player" && !thing.despawn).map(entity => entity.body.position);
						this.nextSafeZone = {
							hitbox: new CircleHitbox(Math.sqrt(Vector.magnitudeSquared(this.size) * 0.25 * this.zoneData[this.zoneStep].area)),
							position: positions.length ? Vector.mult(positions.reduce((a, b) => Vector.add(a, b)), 1 / positions.length) : this.nextSafeZone.position
						};
						this.zoneTick = this.zoneData[this.zoneStep].wait * TICKS_PER_SECOND;
					}
				}
			}
			if (this.zoneMoving) {
				const vec = Vector.sub(this.nextSafeZone.position, this.safeZone.oPosition);
				this.safeZone.position = Vector.add(this.safeZone.oPosition, Vector.mult(vec, (this.zoneData[this.zoneStep].move * TICKS_PER_SECOND - this.zoneTick) / (this.zoneData[this.zoneStep].move * TICKS_PER_SECOND)));
				this.safeZone.hitbox = new CircleHitbox((this.safeZone.oHitbox.radius - this.nextSafeZone.hitbox.radius) * this.zoneTick / (this.zoneData[this.zoneStep].move * TICKS_PER_SECOND) + this.nextSafeZone.hitbox.radius);
			}
		}
	}

	// Called after data are sent to clients
	postTick() {
		this.things.forEach(thing => thing.animations = []);
		this.particles = [];
		this.onceSounds = [];
		this.killFeeds = [];
		this.discards = [];
		this.dirtys = [];
	}

	spawn(...things: Thing[]) {
		for (const thing of things) {
			if (thing.layers.some(layer => clamp(layer, 0, LAYERS) !== layer)) continue;
			for (const layer of thing.layers)
				Composite.add(this.engines[layer].world, thing.body);
			this.things.push(thing);
		}
	}

	addBuilding(building: Building) {
		this.buildings.push(building);
		this.spawn(...building.obstacles.map(ob => ob.obstacle));
	}
}
