import * as fs from "fs";
import Building from "./building";
import { RedZoneDataEntry } from "./data";
import { CircleHitbox, Vec2 } from "./math";
import { Particle } from "./particle";
import { EntityTypes, PLAYER_THRESHOLD, TICKS_PER_SECOND } from "../constants";
import { Player } from "../store/entities";
import { Terrain } from "./terrain";
import { reset } from "..";
import { Thing } from "./thing";

export class World {
	ticks = 0;
	size: Vec2;
	things: Thing[] = [];
	buildings: Building[] = [];
	discards: string[] = [];
	dirtys: Thing[] = [];
	defaultTerrain: Terrain;
	terrains: Terrain[] = [];
	lastSecond = 0;
	playerCount = 0;

	// Red zone stuff
	private zoneActive = false;
	private zoneData: RedZoneDataEntry[];
	private zoneStep = 0;
	zoneMoving = false;
	private zoneTick: number;
	zoneDamage: number;
	nextSafeZone: { hitbox: CircleHitbox; position: Vec2; };
	safeZone: { hitbox: CircleHitbox; oHitbox: CircleHitbox; position: Vec2; oPosition: Vec2; };

	// These should be sent once only to the client
	particles: Particle[] = [];
	onceSounds: { path: string; position: Vec2; }[] = []; // Sent when stuff happens, e.g. effect sounds
	joinSounds: { path: string; position: Vec2; }[] = []; // Sent when player joins, e.g. music

	//Kill feed storage
	killFeeds: { weaponUsed: string; killer: string; killed: string; }[] = [];
	constructor(size: Vec2, defaultTerrain: Terrain) {
		// Set the size of map
		this.size = size;

		// Set the terrains
		this.defaultTerrain = defaultTerrain;

		// Red zone init
		this.zoneData = <RedZoneDataEntry[]>JSON.parse(fs.readFileSync("../data/config/red_zone.json", { encoding: "utf8" }));
		this.zoneTick = this.zoneData[this.zoneStep].wait * TICKS_PER_SECOND;
		this.zoneDamage = this.zoneData[this.zoneStep].damage;

		this.safeZone = {
			hitbox: new CircleHitbox(this.size.magnitude() * 0.5),
			oHitbox: new CircleHitbox(this.size.magnitude() * 0.5),
			position: this.size.scaleAll(0.5),
			oPosition: this.size.scaleAll(0.5)
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
		this.playerCount = this.things.filter(entity => entity.type == EntityTypes.PLAYER && !entity.despawn).length;
		if (this.zoneActive || this.zoneTick > 0) return;
		if (!this.playerCount) {
			console.log("All players have died. Resetting game...");
			reset();
		}
	}

	terrainAtPos(position: Vec2) {
		// Loop from last to first
		for (let ii = this.terrains.length - 1; ii >= 0; ii--) {
			const terrain = this.terrains[ii];
			if (terrain.inside(position, false)) return terrain;
		}
		return this.defaultTerrain;
	}

	tick() {
		this.ticks++;
		// TPS observer
		/*if (!this.lastSecond) this.lastSecond = Date.now();
		else if (Date.now() - this.lastSecond >= 1000) {
				console.log("TPS:", this.ticks);
				this.lastSecond = Date.now();
				this.ticks = 0;
		}*/
		// Merge obstacles
		const allThings = this.things.concat(...this.buildings.map(b => b.obstacles.map(o => o.obstacle)));

		// Tick every entity and obstacle.
		let ii: number;
		var removable: number[] = [];
		for (ii = 0; ii < this.things.length; ii++) {
			const things = this.things[ii];
			things.tick(allThings);
			// Mark entity for removal
			if (things.despawn && things.discardable) {
				removable.push(ii);
				this.discards.push(things.id);
			} else if (things.dirty) {
				things.unmarkDirty();
				this.dirtys.push(things);
			}
		}
		// Remove all discardable things
		for (ii = removable.length - 1; ii >= 0; ii--) this.things.splice(removable[ii], 1);

		// Tick red zone [DISABLED]
		/*if (this.zoneActive) {
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
						const positions = this.entities.filter(entity => entity.type === "player" && !entity.despawn).map(entity => entity.position);
						this.nextSafeZone = {
							hitbox: new CircleHitbox(Math.sqrt(this.size.scaleAll(0.5).magnitudeSqr() * this.zoneData[this.zoneStep].area)),
							position: positions.length ? positions.reduce((a, b) => a.addVec(b)).scaleAll(1 / positions.length) : this.nextSafeZone.position
						};
						this.zoneTick = this.zoneData[this.zoneStep].wait * TICKS_PER_SECOND;
					}
				}
			}
			if (this.zoneMoving) {
				const vec = this.nextSafeZone.position.addVec(this.safeZone.oPosition.inverse());
				this.safeZone.position = this.safeZone.oPosition.addVec(vec.scaleAll((this.zoneData[this.zoneStep].move * TICKS_PER_SECOND - this.zoneTick) / (this.zoneData[this.zoneStep].move * TICKS_PER_SECOND)));
				this.safeZone.hitbox = new CircleHitbox((this.safeZone.oHitbox.radius - this.nextSafeZone.hitbox.radius) * this.zoneTick / (this.zoneData[this.zoneStep].move * TICKS_PER_SECOND) + this.nextSafeZone.hitbox.radius);
			}
		}*/
	}

	// Called after data are sent to clients
	postTick() {
		this.things = this.things.map(entity => {
			entity.animations = [];
			return entity;
		});
		this.particles = [];
		this.onceSounds = [];
		this.killFeeds = [];
		this.discards = [];
		this.dirtys = [];
	}
}
