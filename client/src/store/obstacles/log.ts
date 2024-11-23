import { OBSTACLE_SUPPLIERS } from ".";
import { ObstacleTypes } from "../../constants";
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
	static readonly TYPE = ObstacleTypes.LOG;
	type = Log.TYPE;
	special!: "stump" | "1" | "2" | "3" | "4" | "5";
	static images = new Map<string, HTMLImageElement>();
	static imagesResidue = new Map<string, HTMLImageElement>();
	static {
		const specials = ["stump", "1", "2", "3", "4", "5"]
		for (let ii = 0; ii < specials.length; ii++) {
			Log.images.set(specials[ii], new Image())
			Log.imagesResidue.set(specials[ii], new Image())
		}
		OBSTACLE_SUPPLIERS.set(Log.TYPE, new LogSupplier());
	}
	static updateAssets() {
		const specials = ["stump", "1", "2", "3", "4", "5"]
		for (let ii = 0; ii < specials.length; ii++ ) {
			const image = new Image()
			image.src = "assets/" + getMode() + "/images/game/objects/log_" + specials[ii] + ".svg"
			Log.images.set(specials[ii], image)

			const RESimage = new Image()
			RESimage.src = "assets/" + getMode() + "/images/game/objects/residues/log_" + specials[ii] + ".svg"
			Log.imagesResidue.set(specials[ii], RESimage)
		}
	}

	copy(minObstacle: MinObstacle & AdditionalObstacle) {
		super.copy(minObstacle);
		this.special = minObstacle.special;
	}

	render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		const img = Log.images.get(this.special)!
		if (!img.complete || !Log.imagesResidue.get(this.special)!) return;
		/*const relative = this.position.addVec(you.position.inverse());
		const width = scale * (<RectHitbox>this.hitbox).width * (this.despawn ? 0.5 : 1), height = width * img.naturalWidth / Log.images.get(this.special)!.naturalHeight;
		ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
		ctx.rotate(-this.direction.angle() );
		ctx.drawImage(this.despawn ? Log.imagesResidue.get(this.special)! : img, -width / 2, -height / 2, width, height);
		ctx.resetTransform();
		*/
		const relative = this.position.addVec(you.position.inverse());
		ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
		ctx.rotate(-this.direction.angle());
		// Times 2 because radius * 2 = diameter
		const width = scale * this.hitbox.comparable * 2 * (this.despawn ? 0.5 : 1), height = width * img.naturalWidth / img.naturalHeight;
		ctx.drawImage(img, -width / 2, -height / 2, width, height);
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