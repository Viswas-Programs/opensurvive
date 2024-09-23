// Note: This is the gun item

import { Vector } from "matter-js";
import { world } from "../..";
import { CircleHitbox, CommonAngles, Vec2 } from "../../types/math";
import { GunColor } from "../../types/misc";
import { GunWeapon } from "../../types/weapon";
import { castCorrectWeapon, WEAPON_SUPPLIERS } from "../weapons";
import Item from "./item";
import Player from "./player";

export default class Gun extends Item {
	type = "gun";
	nameId: string; // Gun ID, but id was taken for entity already
	color: GunColor;

	constructor(nameId: string, color: GunColor) {
		super(new CircleHitbox(2));
		if (!WEAPON_SUPPLIERS.has(nameId)) console.warn("Creating a gun entity that doesn't have a supplier for its type");
		this.nameId = nameId;
		this.color = color;
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
		gun.body.position = Vector.clone(this.body.position);
		gun.setVelocity(Vector.mult(Vector.rotate(Vector.create(1, 0), Math.random() * CommonAngles.TWO_PI), 0.025));
		world.spawn(gun);
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
}