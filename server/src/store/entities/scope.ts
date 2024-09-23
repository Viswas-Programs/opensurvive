import { Vector } from "matter-js";
import { world } from "../..";
import { CircleHitbox } from "../../types/math";
import Item from "./item";
import Player from "./player";

export default class Scope extends Item {
	type = "scope";
	zoom: number;

	constructor(zoom: number) {
		super(new CircleHitbox(1));
		this.zoom = zoom;
	}

	picked(player: Player) {
		world.onceSounds.push({ path: "items/scope_equip.mp3", position: this.body.position });
		if (player.inventory.scopes.includes(this.zoom)) {
			this.randomVelocity(Vector.add(this.body.position, Vector.neg(player.body.position)));
			return false;
		}
		return player.inventory.addScope(this.zoom);
	}

	translationKey() {
		return `${super.translationKey()} ${this.zoom}`;
	}

	minimize() {
		return Object.assign(super.minimize(), { zoom: this.zoom });
	}
}