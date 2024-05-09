import { IslandrBitStream } from "./packets";
import Player from "./store/entities/player";
import { Roof } from "./store/obstacles";
import { MinEntity, MinObstacle, MinParticle} from "./types/minimized";
import { Obstacle } from "./types/obstacle";
import { GunWeapon } from "./types/weapon";

export function serialiseMinParticles(particleArray: MinParticle[], stream: IslandrBitStream) {
    stream.writeInt8(particleArray.length)
    particleArray.forEach((particle: MinParticle) => {
        stream.writeId(particle.id);
        stream.writeFloat64(particle.position.x); stream.writeFloat64(particle.position.y);
        stream.writeFloat32(particle.size);
    })

}

export function calculateAllocBytesForObs(obstacleArray: Obstacle[]): number {
	let allocBytes = 1;
	obstacleArray.forEach(obstacle => {
		allocBytes += 59
		if (obstacle.hitbox.type == "circle") allocBytes += 8;
		else allocBytes += 16;
		obstacle.animations.forEach(animation => { allocBytes += 15 })
		if (obstacle.type == "roof") {
			allocBytes += 31;
			(<Roof>obstacle).roofless.forEach(id => allocBytes += 12);
		}
		if ((obstacle as any).special) {allocBytes +=10 }
	})
	return allocBytes
}
export function serialiseMinObstacles(obstacleArray: MinObstacle[], stream: IslandrBitStream) {
    stream.writeInt8(obstacleArray.length)
	obstacleArray.forEach((obstacle: MinObstacle) => {
        stream.writeId(obstacle.id);
        stream.writeASCIIString(obstacle.type, 11);
		stream.writeFloat64(obstacle.position.x); stream.writeFloat64(obstacle.position.y);
		stream.writeFloat64(obstacle.direction.x); stream.writeFloat64(obstacle.direction.y);
		if (obstacle.hitbox.type == "circle") { stream.writeBoolean(true); stream.writeFloat64(obstacle.hitbox.radius); }
		else { stream.writeBoolean(false); stream.writeFloat64(obstacle.hitbox.width); stream.writeFloat64(obstacle.hitbox.height); }
        stream.writeBoolean(obstacle.despawn);
        stream.writeInt8(obstacle.animations.length)
        obstacle.animations.forEach((animation: string) => {
            stream.writeASCIIString(animation, 15)
		})
		if (obstacle.type == "roof") {
			stream.writeInt8((<any>obstacle).roofless.length);
			for (let ii = 0; ii < (<any>obstacle).roofless.length; ii++) {
				stream.writeId((<any>obstacle).roofless[ii])
			}
			stream.writeInt32((<any>obstacle).color)
			stream.writeASCIIString((<any>obstacle).texture.path, 25)
			stream.writeInt8((<any>obstacle).texture.horizontalFill)
		}
		if ((<any>obstacle).special) {
			stream.writeBoolean(true)
			stream.writeASCIIString((<any>obstacle).special, 10)
		}
		else {stream.writeBoolean(false) }
    })
}
export function standardEntitySerialiser(entity: MinEntity, stream: IslandrBitStream) {
	stream.writeASCIIString(entity.type, 20)
	stream.writeId(entity.id)
	//write the type
	//write position
	stream.writeFloat64(entity.position.x)
	stream.writeFloat64(entity.position.y)
	//write direction
	stream.writeFloat64(entity.direction.x)
	stream.writeFloat64(entity.direction.y)
	//write hitbox type
	const hitbox = entity.hitbox;
	if (hitbox.type == "circle") { stream.writeBoolean(true); stream.writeFloat64(hitbox.radius) }
	else { stream.writeBoolean(false); stream.writeFloat64(hitbox.height); stream.writeFloat64(hitbox.width) }
	//write the hitbox configuration
	//despawn configs
	stream.writeBoolean(entity.despawn);
	stream.writeInt8(entity.animations.length)
	entity.animations.forEach(animation => stream.writeASCIIString(animation, 15))
}

let usernamesAndIDsSent = false;

export function calculateAllocBytesForTickPkt(player: Player): number {
	let allocBytes = 69;
	if (!usernamesAndIDsSent) allocBytes += 46
	if (player.currentHealItem) allocBytes += 15
	if (player.interactMessage) allocBytes += 40
	player.animations.forEach(() => allocBytes += 15)
	for (let ii = 0; ii < 4; ii++) {
		if (player.inventory.getWeapon(ii) != undefined){allocBytes += 13
			if (ii < 3 && player.inventory.getWeapon(ii)?.type == "gun") {allocBytes++ }}}
	if (player.inventory.healings) {
		for (let ii = 0; ii < Object.keys(player.inventory.healings).length; ii++) {allocBytes += 16}}
	for (let ii = 0; ii < player.inventory.scopes.length; ii++) { allocBytes++ }
	if (player.inventory.utilities) {
		for (let ii = 0; ii < Object.keys(player.inventory.utilities).length; ii++) { allocBytes += 16 }}
	for (let ii = 0; ii < player.inventory.ammos.length; ii++) { allocBytes++ }
	return allocBytes;
}
export function serialisePlayer(player: Player, stream: IslandrBitStream) {
	// heal items
	stream.writeBoolean(!!player.currentHealItem)
	if (player.currentHealItem)stream.writeHealingItem(player.currentHealItem ? player.currentHealItem : "")
	// interact message
	stream.writeBoolean(!!player.interactMessage)
	if (player.interactMessage)stream.writeASCIIString(player.interactMessage ? player.interactMessage : "", 40)
	if (!usernamesAndIDsSent) stream.writeId(player.id)
	if (!usernamesAndIDsSent) stream.writeUsername(player.username)
	stream.writeFloat32(player.boost)
	stream.writeInt8(player.scope)
	stream.writeBoolean(player.canInteract)
	stream.writeInt8(player.inventory.backpackLevel) //inventory's backpackLevel 
	stream.writeInt8(player.inventory.helmetLevel) //inventory's helmetLevel
	stream.writeInt8(player.inventory.vestLevel) // inventory vestLevel
	stream.writeInt8(player.inventory.holding) // inventory holding currently
	for (let ii = 0; ii < 4; ii++) {
		if (player.inventory.getWeapon(ii) == undefined) stream.writeBoolean(false);
		else {
			stream.writeBoolean(true)
			stream.writeASCIIString(player.inventory.getWeapon(ii)!.minimize().nameId, 13)
			if (ii < 3 && player.inventory.getWeapon(ii)?.type == "gun") { stream.writeInt8((player.inventory.getWeapon(ii)! as GunWeapon).magazine) }
		}
	}
	if (player.inventory.healings) {
		stream.writeInt8(Object.keys(player.inventory.healings).length)
		for (let ii = 0; ii < Object.keys(player.inventory.healings).length; ii++) {
			stream.writeHealingItem(Object.keys(player.inventory.healings)[ii])
			stream.writeInt8(Number(Object.values(player.inventory.healings)[ii]))
		}
	}
	else {
		stream.writeInt8(0)
	}
	stream.writeInt8(player.inventory.scopes.length)
	for (let ii = 0; ii < player.inventory.scopes.length; ii++) {
		stream.writeInt8(player.inventory.scopes[ii])
	}
	if (player.inventory.utilities) {
		stream.writeInt8(Object.keys(player.inventory.utilities).length)
		for (let ii = 0; ii < Object.keys(player.inventory.utilities).length; ii++) {
			stream.writeASCIIString(Object.keys(player.inventory.utilities)[ii], 15)
			stream.writeInt8(Number(Object.values(player.inventory.utilities)[ii]))
		}
	}
	else {
		stream.writeInt8(0)
	}
	stream.writeInt8(player.inventory.ammos.length)
	for (let ii = 0; ii < player.inventory.ammos.length; ii++) {
		stream.writeInt8(player.inventory.ammos[ii])
	}
	stream.writeInt8(player.inventory.selectedScope)
	//loadouts
	stream.writeSkinOrLoadout(player.skin as string)
	if (!usernamesAndIDsSent) stream.writeSkinOrLoadout(player.deathImg as string)
	// ticks
	stream.writeInt16(player.reloadTicks)
	stream.writeInt16(player.maxReloadTicks)
	stream.writeInt16(player.healTicks)
	stream.writeInt16(player.maxHealTicks)
	stream.writeInt8(player.health)
	// positioning
	stream.writeFloat64(player.position.x)
	stream.writeFloat64(player.position.y)
	// directions
	stream.writeFloat64(player.direction.x)
	stream.writeFloat64(player.direction.y)
	stream.writeInt8(player.animations.length)
	player.animations.forEach(animation => {
		stream.writeASCIIString(animation, 15)
	})
	stream.writeBoolean(player.despawn)
	usernamesAndIDsSent = true
}
export function serialiseDiscardables(discardables: string[], stream: IslandrBitStream) {
	stream.writeInt8(discardables.length);
	discardables.forEach(discardable => stream.writeASCIIString(discardable, 15))
}
