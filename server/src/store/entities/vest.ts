import * as fs from "fs";
import { CircleHitbox } from "../../types/math";
import Item from "./item";
import { world } from "../..";
import Player from "./player";
import { Vector } from "matter-js";

export default class Vest extends Item {
	static readonly VEST_REDUCTION: number[] = [];
	type = "vest";
	level: number;

	static {
		const data = JSON.parse(fs.readFileSync("../data/config/vest_reduction.json", { encoding: "utf8" }));
		this.VEST_REDUCTION.push(...data);
	}

	constructor(level: number) {
		super(new CircleHitbox(1));
		this.level = level;
	}

	picked(player: Player) {
		if (player.inventory.vestLevel >= this.level) {
			this.randomVelocity(Vector.add(this.body.position, Vector.neg(player.body.position)));
			return false;
		}
		if (player.inventory.vestLevel != 0) {
			const vest = new Vest(player.inventory.vestLevel);
			vest.body.position = Vector.clone(player.body.position);
			world.spawn(vest);
		}
		player.inventory.vestLevel = this.level;
		world.onceSounds.push({ path: "items/vest_wear.mp3", position: this.body.position });
		return true;
	}

	translationKey() {
		return `${super.translationKey()} ${this.level}`;
	}

	minimize() {
		return Object.assign(super.minimize(), { level: this.level });
	}
}