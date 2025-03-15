import { DeathImgToNum, gunIDsToNum, ObstacleTypes, SkinsEncoding } from "./constants";
import { IslandrBitStream } from "./packets";
import Player from "./store/entities/player";
import { Roof } from "./store/obstacles";
import { MinEntity, MinHitbox, MinObstacle, MinParticle} from "./types/minimized";
import { Obstacle } from "./types/obstacle";
import { GunWeapon } from "./types/weapon";
export function writeHitboxes(hitbox: MinHitbox, stream: IslandrBitStream) {
	if (hitbox.type == "circle") {
		stream.writeInt8(1);
		stream.writeFloat32(hitbox.radius)
	}
	else if (hitbox.type == "rect") {
		if (hitbox.width == hitbox.height) { stream.writeInt8(3); stream.writeFloat32(hitbox.height) }
		else { stream.writeInt8(2); stream.writeFloat32(hitbox.width); stream.writeFloat32(hitbox.height) }
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
		allocBytes += 26
		const hitbox = obstacle.hitbox.minimize()
		if (hitbox.type == "circle") allocBytes += 4;
		else if (hitbox.width == hitbox.height) allocBytes += 4;
		else allocBytes += 8
		obstacle.animations.forEach(animation => { allocBytes += animation.length  + 1})
		if (obstacle.type == ObstacleTypes.ROOF) {
			allocBytes += 31;
			(<Roof>obstacle).roofless.forEach(id => allocBytes +=2);
		}
		if ((obstacle as any).special) {allocBytes +=(<any>obstacle).special.length+1 }
	})
	return allocBytes
}
export function serialiseMinObstacles(obstacleArray: MinObstacle[], stream: IslandrBitStream) {
    stream.writeInt8(obstacleArray.length)
	obstacleArray.forEach((obstacle: MinObstacle) => {
        stream.writeInt16(Number(obstacle.id));
        stream.writeInt8(obstacle.type);
		stream.writeFloat32(obstacle.position.x); stream.writeFloat32(obstacle.position.y);
		stream.writeFloat32(obstacle.direction.x); stream.writeFloat32(obstacle.direction.y);
		writeHitboxes(obstacle.hitbox, stream)
        stream.writeBoolean(obstacle.despawn);
        stream.writeInt8(obstacle.animations.length)
        obstacle.animations.forEach((animation: string) => {
            stream.writeASCIIString(animation)
		})
		if (obstacle.type == ObstacleTypes.ROOF) {
			stream.writeInt8((<any>obstacle).roofless.length);
			for (let ii = 0; ii < (<any>obstacle).roofless.length; ii++) {
				stream.writeInt16(Number((<any>obstacle).roofless[ii]))
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
	stream.writeInt8(entity.type)
	stream.writeInt16(Number(entity.id))
	//write the type
	//write position
	stream.writeFloat32(entity.position.x)
	stream.writeFloat32(entity.position.y)
	//write direction
	stream.writeFloat32(entity.direction.x)
	stream.writeFloat32(entity.direction.y)
	//despawn configs
	stream.writeBoolean(entity.despawn);
	if (entity._needsToSendAnimations) {
		stream.writeInt8(entity.animations.length)
		entity.animations.forEach(animation => stream.writeASCIIString(animation))
	}
}


export function calculateAllocBytesForTickPkt(player: Player): number {
	let allocBytes = 49;
	if (!player.usernamesAndIDsSent) allocBytes += player.username.length + 3 // 3 -> 1 (death img) + 2(id)
	if (player.currentHealItem) allocBytes += player.currentHealItem.length
	if (player.interactMessage) allocBytes += player.interactMessage.length
	player.animations.forEach((animation) => allocBytes += animation.length)
	for (let ii = 0; ii < player.inventory.ammos.length; ii++) {allocBytes+=2}
	for (let ii = 0; ii < 4; ii++) {
		if (player.inventory.getWeapon(ii) != undefined) {
			allocBytes ++;
			if (ii < 3 && player.inventory.getWeapon(ii)?.type == "gun") {allocBytes++ }}}
	if (player.inventory.healings) {
		for (let ii = 0; ii < Object.keys(player.inventory.healings).length; ii++) {allocBytes += 2}}
	for (let ii = 0; ii < player.inventory.scopes.length; ii++) { allocBytes++ }
	if (player.inventory.utilities) {
		for (let ii = 0; ii < Object.keys(player.inventory.utilities).length; ii++) { allocBytes += Object.keys(player.inventory.utilities)[ii].length +1  }}
	for (let ii = 0; ii < player.inventory.ammos.length; ii++) { allocBytes++ }
	return allocBytes;
}



const healingIDsToNum: Map<string, number> = new Map([
	["energy_drink", 0],
	["medkit", 1],
	["syringe", 2],
	["tourniquet", 3]
])
export function serialisePlayer(player: Player, stream: IslandrBitStream) {
	// heal items
	stream.writeBoolean(!!player.currentHealItem)
	if (player.currentHealItem)stream.writeHealingItem(player.currentHealItem ? player.currentHealItem : "")
	// interact message
	stream.writeBoolean(!!player.interactMessage)
	if (player.interactMessage)stream.writeASCIIString(player.interactMessage ? player.interactMessage : "")
	if (!player.usernamesAndIDsSent) stream.writeInt16(Number(player.id))
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
			stream.writeInt8(gunIDsToNum.get( player.inventory.getWeapon(ii)!.minimize().nameId)!)
			if (ii < 3 && player.inventory.getWeapon(ii)?.type == "gun") { stream.writeInt8((player.inventory.getWeapon(ii)! as GunWeapon).magazine) }
		}
	}
	if (player.inventory.healings) {
		stream.writeInt8(Object.keys(player.inventory.healings).length)
		for (let ii = 0; ii < Object.keys(player.inventory.healings).length; ii++) {
			stream.writeInt8(healingIDsToNum.get(Object.keys(player.inventory.healings)[ii])!)
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
			stream.writeASCIIString(Object.keys(player.inventory.utilities)[ii])
			stream.writeInt8(Number(Object.values(player.inventory.utilities)[ii]))
		}
	}
	else {
		stream.writeInt8(0)
	}
	stream.writeInt8(player.inventory.ammos.length)
	for (let ii = 0; ii < player.inventory.ammos.length; ii++) {
		stream.writeInt16(player.inventory.ammos[ii])
	}
	stream.writeInt8(player.inventory.selectedScope)
	//loadouts
	stream.writeInt8(SkinsEncoding.get(player.skin!)!)
	if (!player.usernamesAndIDsSent) stream.writeInt8(DeathImgToNum.get(player.deathImg!)!)
	// ticks
	stream.writeInt16(player.reloadTicks)
	stream.writeInt16(player.maxReloadTicks)
	stream.writeInt16(player.healTicks)
	stream.writeInt16(player.maxHealTicks)
	let health = player.health
	if (health < 0) health = 0;
	stream.writeInt8(health)
	// positioning
	stream.writeFloat32(player.position.x)
	stream.writeFloat32(player.position.y)
	// directions
	stream.writeFloat32(player.direction.x)
	stream.writeFloat32(player.direction.y)
	stream.writeInt8(player.animations.length)
	player.animations.forEach(animation => {
		stream.writeASCIIString(animation)
	})
	stream.writeBoolean(player.despawn)
	player.usernamesAndIDsSent = true
}
export function serialiseDiscardables(discardables: string[], stream: IslandrBitStream) {
	stream.writeInt8(discardables.length);
	discardables.forEach(discardable => stream.writeInt16(Number(discardable)))
}
