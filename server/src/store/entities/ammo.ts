import { Vector } from "matter-js";
import { Inventory } from "../../types/entity";
import { CircleHitbox } from "../../types/math";
import { GunColor } from "../../types/misc";
import Item from "./item";
import Player from "./player";

export default class Ammo extends Item {
	type = "ammo";
	amount: number;
	color: GunColor;

	constructor(amount: number, color: GunColor) {
		super(new CircleHitbox(1));
		this.amount = amount;
		this.color = color;
	}

	picked(player: Player) {
		const newAmount = Math.min(Inventory.maxAmmos[player.inventory.backpackLevel][this.color], player.inventory.ammos[this.color] + this.amount);
		const delta = newAmount - player.inventory.ammos[this.color];
		player.inventory.ammos[this.color] = newAmount;
		if (delta != this.amount) {
			this.amount -= delta;
			this.randomVelocity(Vector.add(this.body.position, Vector.neg(player.body.position)));
			return false;
		}
		return true;
	}

	translationKey() {
		return `${super.translationKey()}.${this.color} ${this.amount}`;
	}

	minimize() {
		const min = super.minimize();
		return Object.assign(min, { amount: this.amount, color: this.color });
	}
}