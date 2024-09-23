// Note: This is the gun item

import { world } from "../..";
import { EntityTypes } from "../../constants";
import { IslandrBitStream } from "../../packets";
import { standardEntitySerialiser } from "../../serialisers";
import { CircleHitbox, CommonAngles, Vec2 } from "../../types/math";
import { GunColor } from "../../types/misc";
import { GunWeapon } from "../../types/weapon";
import { castCorrectWeapon, WEAPON_SUPPLIERS } from "../weapons";
import Item from "./item";
import Player from "./player";

export default class Gun extends Item {
	type = EntityTypes.GUN;
	hitbox = new CircleHitbox(2);
	nameId: string; // Gun ID, but id was taken for entity already
	color: GunColor;

	constructor(nameId: string, color: GunColor) {
		super();
		if (!WEAPON_SUPPLIERS.has(nameId)) console.warn("Creating a gun entity that doesn't have a supplier for its type");
		this.nameId = nameId;
		this.color = color;
		this.allocBytes += 15
		this._needToSendAnimations = true
		this.animations.forEach(animation => this.allocBytes += animation.length)
	}

	picked(player: Player) {
		// Loop through gun slots to see if there's an empty slot
		for (let ii = 0; ii < 3; ii++) {
			if (!player.inventory.getWeapon(ii)) {
				player.inventory.setWeapon(castCorrectWeapon(this.nameId), ii);
				// If player is holding a melee weapon, automatically switch to the gun
				if (player.inventory.holding == 2)
					player.inventory.holding = ii;
				player.reload()
				return true;
			}
		}
		// There is no empty gun slot
		// If player is holding melee weapon, don't switch
		if (player.inventory.holding >= 2) return false;
		// Spawn swapped weapon
		const weapon = <GunWeapon>player.inventory.getWeapon();
		const gun = new Gun(weapon.nameId, weapon.color);
		gun.position = this.position;
		gun.velocity = Vec2.UNIT_X.addAngle(Math.random() * CommonAngles.TWO_PI).scaleAll(0.025);
		world.things.push(gun);
		// Swap the player's weapon on hand with the one on ground
		player.inventory.setWeapon(castCorrectWeapon(this.nameId));
		return true;
	}

	translationKey() {
		return `${super.translationKey()}.${this.nameId}`;
	}

	minimize() {
		const min = super.minimize();
		return Object.assign(min, { nameId: this.nameId, color: this.color });
	}
	serialise(stream: IslandrBitStream, player: Player) {
		standardEntitySerialiser(this.minimize(), stream, player)
		stream.writeASCIIString(this.nameId);
		stream.writeInt8(this.color)
	}
}