/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import { readFileSync } from "fs";
import * as ws from "ws";
import { ID, send, wait, sendBitstream, spawnGun} from "./utils";
import { MousePressPacket, MouseReleasePacket, MouseMovePacket, MovementPressPacket, MovementReleasePacket, GamePacket, ParticlesPacket, MapPacket, AckPacket, SwitchWeaponPacket, SoundPacket, UseHealingPacket, ResponsePacket, MobileMovementPacket, AnnouncePacket, PlayerRotationDelta, IPacket, ServerSideScopeUpdate, PlayerTickPkt, GameOverPkt } from "./types/packet";
import { DIRECTION_VEC, EntityTypes, RecvPacketTypes, TICKS_PER_SECOND } from "./constants";
import {  CommonAngles, RectHitbox, Vec2 } from "./types/math";
import { Ammo, Bullet, Gun, Player } from "./store/entities";
import { World } from "./types/world";
import { Plain, castMapTerrain } from "./store/terrains";
import { castMapObstacle } from "./store/obstacles";
import { castBuilding } from "./store/buildings";
import { MapBuildingData, MapData } from "./types/data";
import { IslandrBitStream } from "./packets"
import { GunColor } from "./types/misc";
import Building from "./types/building";
import Scope from "./store/entities/scope";
import Healing from "./store/entities/healing";
import { GunWeapon, Weapon, WeaponType } from "./types/weapon";
export var ticksElapsed = 0;

const server = new ws.Server({ port: 8080 });
server.once("listening", () => console.log(`WebSocket Server listening at port ${server.options.port}`));

export const sockets = new Map<string, ws.WebSocket>();

// Initialize the map
export var world: World;
export function reset(map = "regular") {
	for (const socket of sockets.values()) socket.close();
	sockets.clear();
	
	const mapData = <MapData>JSON.parse(readFileSync(`../data/maps/${map}.json`, { encoding: "utf8" }));

	world = new World(Vec2.fromArray(mapData.size), castMapTerrain({ id: mapData.defaultTerrain }) || new Plain());
	// Add terrains
	let ii: number;
	for (const data of mapData.terrains) {
		for (ii = 0; ii < (data.amount || 1); ii++) {
			const terrain = castMapTerrain(data);
			if (!terrain) continue;
			world.terrains.push(terrain);
		}
	}
	function __checkBuildingOverlapOtherTerrains(data: MapBuildingData, position: Vec2, building: Building) {
		if (data.id == "cross") { return data.includeTerrains!.includes(world.terrainAtPos(position).id) }
		else {
			for (let ii = 0; ii < world.buildings.length; ii++) {
				if (
					world.buildings[ii].zoneHitbox!.inside(position, world.buildings[ii].position, world.buildings[ii].direction) ||
					world.buildings[ii].zoneHitbox!.inside(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).height, (building!.zones[0].hitbox as RectHitbox).width])), world.buildings[ii].position, world.buildings[ii].direction) ||
					world.buildings[ii].zoneHitbox!.inside(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).height, -(building!.zones[0].hitbox as RectHitbox).width])), world.buildings[ii].position, world.buildings[ii].direction) ||
					world.buildings[ii].zoneHitbox!.inside(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).height, (building!.zones[0].hitbox as RectHitbox).width])), world.buildings[ii].position, world.buildings[ii].direction) ||
					world.buildings[ii].zoneHitbox!.inside(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).height, -(building!.zones[0].hitbox as RectHitbox).width])), world.buildings[ii].position, world.buildings[ii].direction)
				) { return false }
			}
			return (
				data.includeTerrains!.includes(world.terrainAtPos(position).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).height, (building!.zones[0].hitbox as RectHitbox).width]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).height, -(building!.zones[0].hitbox as RectHitbox).width]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).height, (building!.zones[0].hitbox as RectHitbox).width]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).height, -(building!.zones[0].hitbox as RectHitbox).width]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).height + 2, (building!.zones[0].hitbox as RectHitbox).width + 2]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).height - 2, -(building!.zones[0].hitbox as RectHitbox).width - 2]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).height - 2, (building!.zones[0].hitbox as RectHitbox).width + 2]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).height + 2, -(building!.zones[0].hitbox as RectHitbox).width - 2]))).id) &&

				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).width, (building!.zones[0].hitbox as RectHitbox).height]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).width, -(building!.zones[0].hitbox as RectHitbox).height]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).width, (building!.zones[0].hitbox as RectHitbox).height]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).width, -(building!.zones[0].hitbox as RectHitbox).height]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).width + 2, (building!.zones[0].hitbox as RectHitbox).height + 2]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).width - 2, -(building!.zones[0].hitbox as RectHitbox).height - 2]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([-(building!.zones[0].hitbox as RectHitbox).width - 2, (building!.zones[0].hitbox as RectHitbox).height + 2]))).id) &&
				data.includeTerrains!.includes(world.terrainAtPos(position.addVec(Vec2.fromArray([(building!.zones[0].hitbox as RectHitbox).width + 2, -(building!.zones[0].hitbox as RectHitbox).height - 2]))).id) 
			)
		}
	}
	// Add buildings
	for (const data of mapData.buildings) {
		for (ii = 0; ii < (data.amount || 1); ii++) {
			const building = castBuilding(data.id);
			if (!building) continue;
			let position = world.size.scale(Math.random(), Math.random());
			if (data.position) position = Vec2.fromArray(data.position);
			else if (data.includeTerrains)
				while (!__checkBuildingOverlapOtherTerrains(data, position, building))
					position = world.size.scale(Math.random(), Math.random());
			building.setPosition(position);
			if (data.direction) building.setDirection(Vec2.fromArray(data.direction));
			else building.setDirection(Vec2.UNIT_X.addAngle(Math.floor(Math.random() * 4) * CommonAngles.PI_TWO));
			world.buildings.push(building);
		}
	}
	
	// Add obstacles
	for (const data of mapData.obstacles) {
		for (ii = 0; ii < (data.amount || 1); ii++) {
			const obstacle = castMapObstacle(data);
			if (!obstacle) continue;
			world.obstacles.push(obstacle);
		}
	}
}
reset();
const playerInitialPacketsSent = new Map<ws.WebSocket, boolean>()

server.on("connection", async socket => {
	console.log("Received a connection request");
	// Set the type for msgpack later.
	socket.binaryType = "arraybuffer";

	// Add socket to map with a generated ID.
	const id = ID();
	sockets.set(id, socket);

	// Setup the close connection listener. Socket will be deleted from map.
	var connected = false;
	socket.on("close", () => {
		try { player.die(); }
		catch (err) {console.log("hi") }		
		console.log("Connection closed");
		sockets.delete(id);
		connected = false;
	});

	let username = "";
	let accessToken: string | undefined = undefined;
	let skin = "default";
	let deathImg = "default";
	let isMobile = false;
	// Communicate with the client by sending the ID and map size. The client should respond with ID and username, or else close the connection.
	await Promise.race([wait(10000), new Promise<void>(resolve => {
		sendBitstream(socket, new AckPacket(id, TICKS_PER_SECOND, world.size, world.defaultTerrain));
		socket.once("message", (msg: ArrayBuffer) => {
			const stream = new IslandrBitStream(msg)
			const type = stream.readPacketType()
			const decoded = new ResponsePacket();
			decoded.deserialise(stream);
			if (id.includes(decoded.id) && decoded.username && decoded.skin && decoded.deathImg) {
				connected = true;
				username = decoded.username;
				accessToken = decoded.accessToken;
				skin = decoded.skin;
				deathImg = decoded.deathImg;
				isMobile = decoded.isMobile;
			} else try { socket.close(); } catch (err) { }
			resolve();
		})
	})]);
	if (!connected) return;
	console.log(`A new player with ID ${id} connected!`);
	playerInitialPacketsSent.set(socket, false)
	// Create the new player and add it to the entity list.
	const player = new Player(id, username, skin, deathImg, accessToken, isMobile);
	world.addPlayer(player);
	// Send the player the entire map
	send(socket, new MapPacket(world.obstacles, world.buildings, world.terrains.concat(...world.buildings.map(b => b.floors.map(fl => fl.terrain)))));
	// Send the player initial objects
	send(socket, new GamePacket(world.entities, world.obstacles.concat(...world.buildings.map(b => b.obstacles.map(o => o.obstacle))), player, world.playerCount, true));
	playerInitialPacketsSent.set(socket, true);
	sendBitstream(socket, new PlayerTickPkt(player));
	//spawnGun("stf_12", GunColor.RED, player.position, 16, true)
	const e = new Scope(8);
	e.position = player.position; world.entities.push(e);
	const f = new Scope(4);
	f.position = player.position; world.entities.push(f);
	// If the client doesn't ping for 30 seconds, we assume it is a disconnection.
	const timeout = setTimeout(() => {
		try {socket.close(); } catch (err) { }
	}, 30000);

	// The 4 directions of movement
	const movements = [false, false, false, false];
	const buttons = new Map<number, boolean>();

	socket.on("message", (msg: ArrayBuffer) => {
		const stream = new IslandrBitStream(msg)
		const type = stream.readPacketType()
		switch (type) {
			case RecvPacketTypes.PING:
				timeout.refresh();
				break;
			case RecvPacketTypes.MOV_RESET:
				player.setVelocity(Vec2.ZERO)
				break;
			case RecvPacketTypes.PL_ROATION:
				const RotationPacket = new PlayerRotationDelta()
				RotationPacket.deserialise(stream)
				player.setDirection(new Vec2(Math.cos(RotationPacket.angle) * 1.45, Math.sin(RotationPacket.angle) * 1.45))
				break;
			case RecvPacketTypes.MOBILE_MOV:
				const MMvPacket = new MobileMovementPacket()
				MMvPacket.deserialise(stream)
				player.setVelocity(new Vec2(Math.cos(MMvPacket.direction) * 1.45, Math.sin(MMvPacket.direction) * 1.45))
				break;
			case RecvPacketTypes.MOV_PRESS:
				// Make the direction true
				const mvPPacket = new MovementPressPacket()
				mvPPacket.deserialise(stream)
				movements[mvPPacket.direction] = true;
				// Add corresponding direction vector to a zero vector to determine the velocity and direction.
				var angleVec = Vec2.ZERO;
				for (let ii = 0; ii < movements.length; ii++) if (movements[ii]) angleVec = angleVec.addVec(DIRECTION_VEC[ii]);
				player.setVelocity(angleVec.unit());
				break;
			case RecvPacketTypes.MOV_REL:
				// Make the direction false
				const mvRPacket = new MovementReleasePacket();
				mvRPacket.deserialise(stream)
				movements[mvRPacket.direction] = false;
				// Same as movementpress
				var angleVec = Vec2.ZERO;
				for (let ii = 0; ii < movements.length; ii++) if (movements[ii]) angleVec = angleVec.addVec(DIRECTION_VEC[ii]);
				player.setVelocity(angleVec.unit());
				break;
			// Very not-done. Will probably change to "attack" and "use" tracking.
			case RecvPacketTypes.MOS_PRESS:
				const msPresspkt = new MousePressPacket()
				msPresspkt.deserialise(stream)
				buttons.set((msPresspkt).button, true);
				if (buttons.get(0)) player.tryAttacking = true;
				break;
			case RecvPacketTypes.MOS_REL:
				const msReleasePkt = new MouseReleasePacket()
				msReleasePkt.deserialise(stream);
				buttons.set(msReleasePkt.button, false);
				if (!buttons.get(0)) player.tryAttacking = false;
				break;
			case RecvPacketTypes.MOUSEMOVE:
				const mMvPacket = new MouseMovePacket();
				mMvPacket.deserialise(stream);
				// { x, y } will be x and y offset of the client from the centre of the screen.
				player.setDirection(new Vec2(mMvPacket.x, mMvPacket.y));
				break;
			case RecvPacketTypes.INTERACT:
				player.tryInteracting = true;
				break;
			case RecvPacketTypes.SW_WEAPON:
				const swPacket = new SwitchWeaponPacket();
				swPacket.deserialise(stream)
				if (swPacket.setMode) {
					if (player.inventory.getWeapon(swPacket.delta, false))
						player.inventory.getWeapon(swPacket.delta, true)
				} else {
					const unitDelta = swPacket.delta < 0 ? -1 : 1;
					let holding = player.inventory.holding + swPacket.delta;
					if (holding < 0) holding += player.inventory.weapons.length;
					else holding %= player.inventory.weapons.length;
					while (!player.inventory.getWeapon(holding)) {
						holding += unitDelta;
						if (holding < 0) holding += player.inventory.weapons.length;
						else holding %= player.inventory.weapons.length;
					}
					player.inventory.holding = holding;
				}
				break;
			case RecvPacketTypes.REL_WEAPON:
				player.reload();
				break;
			case RecvPacketTypes.HEAL:
				const healPkt = new UseHealingPacket()
				healPkt.deserialise(stream);
				player.heal((healPkt).item);
				break;
			case RecvPacketTypes.SR_SCOPE_UPD:
				const data = (new ServerSideScopeUpdate());
				data.deserialise(stream);
				player.inventory.selectScope(Number(data.scope))
				player.changedScope = true;
				break;
			case RecvPacketTypes.CANCEL_ACT:
				player.healTicks = 0;
				player.reloadTicks = 0;
				player.healItem = player.currentHealItem = undefined;
				break;
			case RecvPacketTypes.DROP_WEAPON:
				const index = stream.readInt8();
				const weaponToDrop = player.inventory.getWeapon(index);
				if (weaponToDrop && weaponToDrop.droppable) {
					if (weaponToDrop.type == WeaponType.GUN) {
						if (weaponToDrop.nameId in player.weaponsScheduledToReload) { player.weaponsScheduledToReload.splice(player.weaponsScheduledToReload.indexOf(weaponToDrop.nameId), 1) }
						const gun = new Gun(weaponToDrop.nameId, (<GunWeapon>weaponToDrop).color)
						gun.position = player.position;
						const newAmmo = new Ammo((<GunWeapon>weaponToDrop).magazine, (<GunWeapon>weaponToDrop).color)
						newAmmo.position = player.position;
						world.entities.push(newAmmo)
						//newAmmo.interact(player);
						world.entities.push(gun)
						player.inventory.holding = 2
						player.inventory.setWeapon(undefined, index)
					}
				}
		}
	});
});
setInterval(() => {
	world.entities.forEach(entity => {
		if (entity.type == EntityTypes.BULLET) (entity as Bullet).collisionCheck(world.entities, world.obstacles)
	})
}, 5)
setInterval(() => {
	world.tick();
	// Filter players from entities and send them packets
	const players = <Player[]>world.entities.filter(entity => entity.type === EntityTypes.PLAYER);
	players.forEach(player => {
		const socket = sockets.get(player.id);
		if (!socket || !playerInitialPacketsSent.get(socket)) return;
		const pkt = new GamePacket(world.dirtyEntities.filter(entity => entity.id != player.id), world.dirtyObstacles, player, world.playerCount, false, world.discardEntities, world.discardObstacles)
		sendBitstream(socket, pkt);
		sendBitstream(socket, new PlayerTickPkt(player));
		if (world.particles.length) sendBitstream(socket, new ParticlesPacket(world.particles, player));
		//for (const sound of world.onceSounds) sendBitstream(socket, new SoundPacket(sound.path, sound.position));
		for (const killFeed of world.killFeeds) sendBitstream(socket, new AnnouncePacket(killFeed.weaponUsed, killFeed.killer, killFeed.killed))
		//if (player.changedScope) { sendBitstream(socket, new ScopeUpdatePacket(player.lastPickedUpScope)); player.changedScope = false; }
		if ((player.despawn || player.shouldSendStuff) && !player.sentStuff) { sendBitstream(socket, new GameOverPkt(player.won, player.damageDone, player.damageTaken, player.killCount)); player.sentStuff = true; }
	});
	world.postTick();
}, 1000 / TICKS_PER_SECOND);
