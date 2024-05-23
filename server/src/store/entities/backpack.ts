import { world } from "../..";
import { IslandrBitStream } from "../../packets";
import { standardEntitySerialiser } from "../../serialisers";
import { CircleHitbox } from "../../types/math";
import Item from "./item";
import Player from "./player";

export default class Backpack extends Item {
	type = "backpack";
	hitbox = new CircleHitbox(1);
	level: number;

	constructor(level: number) {
		super();
		this.level = level;
		this.allocBytes++;
	}

	picked(player: Player) {
		if (player.inventory.backpackLevel >= this.level) {
			this.randomVelocity(this.position.addVec(player.position.inverse()));
			return false;
		}
		if (player.inventory.backpackLevel != 0) {
			const backpack = new Backpack(player.inventory.backpackLevel);
			backpack.position = player.position;
			world.entities.push(backpack);
		}
		player.inventory.backpackLevel = this.level;
		world.onceSounds.push({ path: "items/backpack_wear.mp3", position: this.position })
		return true;
	}

	translationKey() {
		return `${super.translationKey()} ${this.level}`;
	}

	minimize() {
		return Object.assign(super.minimize(), { level: this.level });
	}
	serialise(stream: IslandrBitStream, player: Player) {
		standardEntitySerialiser(this.minimize(), stream, player)
		stream.writeInt8(this.level)
	}
}