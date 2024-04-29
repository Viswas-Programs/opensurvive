import { IslandrBitStream } from "./packets";
import Player from "./store/entities/player";
import Roof from "./store/obstacles/roof";
import { MinEntity, MinObstacle, MinParticle} from "./types/minimized";

export function serialiseMinParticles(particleArray: MinParticle[], stream: IslandrBitStream) {
    stream.writeInt8(particleArray.length)
    particleArray.forEach((particle: MinParticle) => {
        stream.writeId(particle.id);
        stream.writeInt16(particle.position.x); stream.writeInt16(particle.position.y);
        stream.writeInt8(particle.size);
    })

}
export function serialiseMinObstacles(obstacleArray: MinObstacle[], stream: IslandrBitStream) {
    stream.writeInt8(obstacleArray.length)
	obstacleArray.forEach((obstacle: MinObstacle) => {
		if (obstacle.hitbox.type != "circle") {console.log(obstacle) }
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
		}
		if ((<any>obstacle).special) {
			stream.writeBoolean(true)
			stream.writeASCIIString((<any>obstacle).special, 20)
		}
		else {stream.writeBoolean(false) }
    })
}
export function serialiseMinEntities(entityArray: MinEntity[], stream: IslandrBitStream) {
    stream.writeInt8(entityArray.length)
	entityArray.forEach((entity: MinEntity) => {
		stream.writeASCIIString(entity.type, 20);
        if (entity.type != "player") {
            stream.writeId(entity.id);
			stream.writeFloat64(entity.position.x); stream.writeFloat64(entity.position.y);
			stream.writeFloat64(entity.direction.x); stream.writeFloat64(entity.direction.y);
            if (entity.hitbox.type == "circle") { stream.writeBoolean(true); stream.writeFloat64(entity.hitbox.radius); }
			else { stream.writeBoolean(false); stream.writeFloat64(entity.hitbox.width); stream.writeFloat64(entity.hitbox.height); }
            stream.writeBoolean(entity.despawn);
            stream.writeInt8(entity.animations.length)
            entity.animations.forEach((animation: string) => {
                stream.writeASCIIString(animation, 15)
            })
        }
		else {
			console.log((<any>entity).skin, "ENTITY SKIN LA")
			stream.writeId(entity.id);
			//write position
			stream.writeFloat64(entity.position.x)
			stream.writeFloat64(entity.position.y)
			//write direction
			stream.writeFloat64(entity.direction.x)
			stream.writeFloat64(entity.direction.y)
			const hitbox = entity.hitbox
			//write the hitbox configuration
			if (hitbox.type == "circle") { stream.writeBoolean(true); stream.writeInt8(hitbox.radius) }
			else { stream.writeBoolean(false); stream.writeFloat64(hitbox.height); stream.writeFloat64(hitbox.width) }
			//write animations
			stream.writeInt8(entity.animations.length)
			entity.animations.forEach(animation => {stream.writeASCIIString(animation, 15) })
			//despawn configs
			stream.writeBoolean(entity.despawn);
			stream.writeInt8((<any>entity).inventory.backpackLevel) //inventory's backpackLevel 
			stream.writeInt8((<any>entity).inventory.helmetLevel) //inventory's helmetLevel
			stream.writeInt8((<any>entity).inventory.vestLevel) // inventory vestLevel
			stream.writeId((<any>entity).inventory.holding) // inventory holding currently,
			stream.writeSkinOrLoadout((<any>entity).skin)
			stream.writeSkinOrLoadout((<any>entity).deathImg)
			
        }
    })
}

export function serialisePlayer(player: Player, stream: IslandrBitStream) {
	stream.writeASCIIString(player.type, player.type.length) //constantly 6  bytes :D
	// heal items
	stream.writeHealingItem(player.currentHealItem ? player.currentHealItem : "")
	// interact message
	stream.writeASCIIString(player.interactMessage ? player.interactMessage : "", 40)
	stream.writeInt8(player.hitbox.radius) // hitbox radius
	stream.writeId(player.id) // id of player
	stream.writeUsername(player.username)
	stream.writeFloat32(player.boost)
	stream.writeInt8(player.maxBoost)
	stream.writeInt8(player.scope)
	stream.writeBoolean(player.canInteract)
	stream.writeInt8(player.inventory.backpackLevel) //inventory's backpackLevel 
	stream.writeInt8(player.inventory.helmetLevel) //inventory's helmetLevel
	stream.writeInt8(player.inventory.vestLevel) // inventory vestLevel
	stream.writeInt8(player.inventory.holding) // inventory holding currently
	for (let ii = 0; ii < 4; ii++) {
		if (player.inventory.getWeapon(ii) == undefined) stream.writeId("null");
		else stream.writeId(player.inventory.getWeapon(ii)!.minimize().nameId)
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
	for (let ii = 0; ii < (<any>player).inventory.scopes.length; ii++) {
		stream.writeInt8((<any>player).inventory.scopes[ii])
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
	stream.writeSkinOrLoadout(player.deathImg as string)
	// ticks
	stream.writeInt8(player.reloadTicks)
	stream.writeInt8(player.maxReloadTicks)
	stream.writeInt8(player.healTicks)
	stream.writeInt8(player.maxHealTicks)
	stream.writeInt8(player.health)
	stream.writeInt8(player.maxHealth)
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
}
export function serialiseDiscardables(discardables: string[], stream: IslandrBitStream) {
	stream.writeInt8(discardables.length);
	discardables.forEach(discardable => stream.writeASCIIString(discardable, 15))
}
