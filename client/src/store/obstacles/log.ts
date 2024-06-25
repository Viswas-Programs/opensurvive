import { OBSTACLE_SUPPLIERS } from ".";
import { getMode } from "../../homepage";
import { RectHitbox } from "../../types/math";
import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { ObstacleSupplier } from "../../types/supplier";
import { Player } from "../entities";
/*
const awcCrateImg: HTMLImageElement & { loaded: boolean } = Object.assign(new Image(), { loaded: false });
awcCrateImg.onload = () => awcCrateImg.loaded = true;
//awmCrateImg.src = "assets/images/game/objects/awm_crate.png";
*/

export interface AdditionalObstacle {
	special: "stump" | "1" | "2" | "3" | "4" | "5" ;
}

export class LogSupplier implements ObstacleSupplier {
	create(minObstacle: MinObstacle & AdditionalObstacle) {
		return new Log(minObstacle);
	}
}

export default class Log extends Obstacle {
	static readonly TYPE = "log";
	type = Log.TYPE;
	special!: "stump" | "1" | "2" | "3" | "4" | "5";
	static images = new Map<string, HTMLImageElement>();
	static imagesResidue = new Map<string, HTMLImageElement>();

	static {
		OBSTACLE_SUPPLIERS.set(Log.TYPE, new LogSupplier());
		for (const spc in ["stump", "1", "2", "3", "4", "5"]) {
			Log.images.set(spc, new Image())
		}
		for (const spc in ["stump", "1", "2", "3", "4", "5"]) {
			Log.imagesResidue.set(spc, new Image())
		}
	}
	static updateAssets() {
		for (const spc in ["stump", "1", "2", "3", "4", "5"]) {
			Log.images.get(spc)!.src = "assets/" + getMode() + "/images/game/objects/log_" + spc + ".svg"
		}
		for (const spc in ["stump", "1", "2", "3", "4", "5"]) {
			Log.imagesResidue.get(spc)!.src = "assets/" + getMode() + "/images/game/objects/residues/log_" + spc + ".svg"
		}
	}

	copy(minObstacle: MinObstacle & AdditionalObstacle) {
		super.copy(minObstacle);
		this.special = minObstacle.special;
	}

	render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		const img = Log.images.get(this.special)!
		if (!img.complete || !Log.imagesResidue.get(this.special)!) return;
		const relative = this.position.addVec(you.position.inverse());
		const width = scale * (<RectHitbox>this.hitbox).width * (this.despawn ? 0.5 : 1), height = width * img.naturalWidth / Log.images.get(this.special)!.naturalHeight;
		ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
		ctx.rotate(-this.direction.angle() );
		ctx.drawImage(this.despawn ? Log.imagesResidue.get(this.special)! : img, -width / 2, -height / 2, width, height);
		ctx.resetTransform();
	}

	renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		ctx.translate(this.position.x * scale, this.position.y * scale);
		switch (this.special) {
			default:
				ctx.fillStyle = "#683c05";
				ctx.fillRect(-2 * scale, -2 * scale, 4 * scale, 4 * scale);
				break;
		}
		ctx.resetTransform();
	}
}