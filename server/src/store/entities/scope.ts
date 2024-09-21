import { world } from "../..";
import { EntityTypes } from "../../constants";
import { IslandrBitStream } from "../../packets";
import { standardEntitySerialiser } from "../../serialisers";
import { CircleHitbox } from "../../types/math";
import Item from "./item";
import Player from "./player";

export default class Scope extends Item {
	type = EntityTypes.SCOPE;
	hitbox = new CircleHitbox(1);
	zoom: number;

	constructor(zoom: number) {
		super();
		this.zoom = zoom;
		this.allocBytes++;
	}

	picked(player: Player) {
		world.onceSounds.push({ "path": "items/scope_equip.mp3", "position": this.position })
		player.changedScope = true;
		player.lastPickedUpScope = this.zoom
		return player.inventory.addScope(this.zoom);
	}

	translationKey() {
		return `${super.translationKey()} ${this.zoom}`;
	}

	minimize() {
		return Object.assign(super.minimize(), { zoom: this.zoom });
	}
	serialise(stream: IslandrBitStream, player: Player) {
		standardEntitySerialiser(this.minimize(), stream, player)
		stream.writeInt8(this.zoom)
	}
}