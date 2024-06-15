import { IslandrBitStream } from "./packets";
import Player from "./store/entities/player";
import { Roof } from "./store/obstacles";
import { MinEntity, MinHitbox, MinObstacle, MinParticle} from "./types/minimized";
import { Obstacle } from "./types/obstacle";
import { GunWeapon } from "./types/weapon";
export function writeHitboxes(hitbox: MinHitbox, stream: IslandrBitStream) {
	if (hitbox.type == "circle") {
		stream.writeInt8(1);
		stream.writeFloat64(hitbox.radius)
	}
	else if (hitbox.type == "rect") {
		if (hitbox.width == hitbox.height) { stream.writeInt8(3); stream.writeFloat64(hitbox.height) }
		else { stream.writeInt8(2); stream.writeFloat64(hitbox.width); stream.writeFloat64(hitbox.height) }
	}
}
export function serialiseMinParticles(particleArray: MinParticle[], stream: IslandrBitStream) {
    stream.writeInt8(particleArray.length)
    particleArray.forEach((particle: MinParticle) => {
        stream.writeId(particle.id);
        stream.writeFloat64(particle.position.x); stream.writeFloat64(particle.position.y);
        stream.writeFloat32(particle.size);
    })

}

export function calculateAllocBytesForObs(obstacleArray: Obstacle[]): number {
	let allocBytes = 2;
	obstacleArray.forEach(obstacle => {
		allocBytes += 51
		allocBytes += obstacle.type.length
		const hitbox = obstacle.hitbox.minimize()
		if (hitbox.type == "circle") allocBytes += 8;
		else if (hitbox.width == hitbox.height) allocBytes += 8;
		else allocBytes += 16
		obstacle.animations.forEach(animation => { allocBytes += animation.length  + 1})
		if (obstacle.type == "roof") {
			allocBytes += 31;
			(<Roof>obstacle).roofless.forEach(id => allocBytes += 12);
		}
		if ((obstacle as any).special) {allocBytes +=(<any>obstacle).special.length+1 }
	})
	return allocBytes
}
export function serialiseMinObstacles(obstacleArray: MinObstacle[], stream: IslandrBitStream) {
    stream.writeInt8(obstacleArray.length)
	obstacleArray.forEach((obstacle: MinObstacle) => {
        stream.writeId(obstacle.id);
        stream.writeASCIIString(obstacle.type);
		stream.writeFloat64(obstacle.position.x); stream.writeFloat64(obstacle.position.y);
		stream.writeFloat64(obstacle.direction.x); stream.writeFloat64(obstacle.direction.y);
		writeHitboxes(obstacle.hitbox, stream)
        stream.writeBoolean(obstacle.despawn);
        stream.writeInt8(obstacle.animations.length)
        obstacle.animations.forEach((animation: string) => {
            stream.writeASCIIString(animation)
		})
		if (obstacle.type == "roof") {
			stream.writeInt8((<any>obstacle).roofless.length);
			for (let ii = 0; ii < (<any>obstacle).roofless.length; ii++) {
				stream.writeId((<any>obstacle).roofless[ii])
			}
			stream.writeInt32((<any>obstacle).color)
			stream.writeASCIIString((<any>obstacle).texture.path)
			stream.writeInt8((<any>obstacle).texture.horizontalFill)
		}
		if ((<any>obstacle).special) {
			stream.writeBoolean(true)
			stream.writeASCIIString((<any>obstacle).special)
		}
		else {stream.writeBoolean(false) }
    })
}
export function standardEntitySerialiser(entity: MinEntity, stream: IslandrBitStream, player: Player) {
	stream.writeASCIIString(entity.type)
	stream.writeId(entity.id)
	//write the type
	//write position
	stream.writeFloat64(entity.position.x)
	stream.writeFloat64(entity.position.y)
	//write direction
	stream.writeFloat64(entity.direction.x)
	stream.writeFloat64(entity.direction.y)
	//despawn configs
	stream.writeBoolean(entity.despawn);
	stream.writeInt8(entity.animations.length)
	entity.animations.forEach(animation => stream.writeASCIIString(animation))
}


export function calculateAllocBytesForTickPkt(player: Player): number {
	let allocBytes = 75;
	if (!player.usernamesAndIDsSent) allocBytes += player.username.length + 12+10
	if (player.currentHealItem) allocBytes += player.currentHealItem.length
	if (player.interactMessage) allocBytes += player.interactMessage.length
	player.animations.forEach((animation) => allocBytes += animation.length)
	for (let ii = 0; ii < player.inventory.ammos.length; ii++) {allocBytes++}
	for (let ii = 0; ii < 4; ii++) {
		if (player.inventory.getWeapon(ii) != undefined) {
			allocBytes += player.inventory.getWeapon(ii)!.nameId.length;
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
	if (player.interactMessage)stream.writeASCIIString(player.interactMessage ? player.interactMessage : "")
	if (!player.usernamesAndIDsSent) stream.writeId(player.id)
	if (!player.usernamesAndIDsSent) stream.writeUsername(player.username)
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
			stream.writeASCIIString(player.inventory.getWeapon(ii)!.minimize().nameId)
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
	if (!player.usernamesAndIDsSent) stream.writeSkinOrLoadout(player.deathImg as string)
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
		stream.writeASCIIString(animation)
	})
	stream.writeBoolean(player.despawn)
	player.usernamesAndIDsSent = true
}
export function serialiseDiscardables(discardables: string[], stream: IslandrBitStream) {
	stream.writeInt8(discardables.length);
	discardables.forEach(discardable => stream.writeASCIIString(discardable))
}
