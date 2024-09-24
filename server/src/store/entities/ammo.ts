import { EntityTypes } from "../../constants";
import { IslandrBitStream } from "../../packets";
import { standardEntitySerialiser } from "../../serialisers";
import { Inventory } from "../../types/entity";
import { CircleHitbox, RectHitbox, Vec2 } from "../../types/math";
import { GunColor } from "../../types/misc";
import Item from "./item";
import Player from "./player";

export default class Ammo extends Item {
	type = EntityTypes.AMMO;
	amount: number;
	color: GunColor;

	constructor(amount: number, color: GunColor) {
		super(new CircleHitbox(1));
		this.amount = amount;
		this.color = color;
		this.allocBytes += 2;
	}

	picked(player: Player) {
		const newAmount = Math.min(Inventory.maxAmmos[player.inventory.backpackLevel][this.color], player.inventory.ammos[this.color] + this.amount);
		const delta = newAmount - player.inventory.ammos[this.color];
		player.inventory.ammos[this.color] = newAmount;
		if (delta != this.amount) {
			this.amount -= delta;
			this.setVelocity(Vec2.UNIT_X.addAngle(this.position.addVec(player.position.inverse()).angle()).scaleAll(0.001));
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
	serialise(stream: IslandrBitStream, player: Player) {
		standardEntitySerialiser(this.minimize(), stream, player)
		stream.writeInt8(this.amount)
		stream.writeInt8(this.color)
	}
}