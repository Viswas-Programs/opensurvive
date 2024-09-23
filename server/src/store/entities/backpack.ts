import { Vector } from "matter-js";
import { world } from "../..";
import { CircleHitbox } from "../../types/math";
import Item from "./item";
import Player from "./player";

export default class Backpack extends Item {
	type = "backpack";
	level: number;

	constructor(level: number) {
		super(new CircleHitbox(1));
		this.level = level;
	}

	picked(player: Player) {
		if (player.inventory.backpackLevel >= this.level) {
			this.randomVelocity(Vector.add(this.body.position, Vector.neg(player.body.position)));
			return false;
		}
		if (player.inventory.backpackLevel != 0) {
			const backpack = new Backpack(player.inventory.backpackLevel);
			backpack.body.position = Vector.clone(player.body.position);
			world.spawn(backpack);
		}
		player.inventory.backpackLevel = this.level;
		world.onceSounds.push({ path: "items/backpack_wear.mp3", position: this.body.position })
		return true;
	}

	translationKey() {
		return `${super.translationKey()} ${this.level}`;
	}

	minimize() {
		return Object.assign(super.minimize(), { level: this.level });
	}
}