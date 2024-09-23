import { Vector } from "matter-js";
import { world } from "../..";
import { CircleHitbox } from "../../types/math";
import Item from "./item";
import Player from "./player";
import * as fs from "fs";

export default class Helmet extends Item {
	static readonly HELMET_REDUCTION: number[] = [];
	type = "helmet";
	level: number;

	static {
		const data = JSON.parse(fs.readFileSync("../data/config/helmet_reduction.json", { encoding: "utf8" }));
		this.HELMET_REDUCTION.push(...data);
	}
	constructor(level: number) {
		super(new CircleHitbox(1));
		this.level = level;
	}

	picked(player: Player) {
		if (player.inventory.helmetLevel >= this.level) {
			this.randomVelocity(Vector.add(this.body.position, Vector.neg(player.body.position)));
			return false;
		}
		if (player.inventory.helmetLevel != 0) {
			const helmet = new Helmet(player.inventory.helmetLevel);
			helmet.body.position = Vector.clone(player.body.position);
			world.spawn(helmet);
		}
		player.inventory.helmetLevel = this.level;
		world.onceSounds.push({ path: "items/helmet_wear.mp3", position: this.body.position })
		return true;
	}

	translationKey() {
		return `${super.translationKey()} ${this.level}`;
	}

	minimize() {
		return Object.assign(super.minimize(), { level: this.level });
	}
}