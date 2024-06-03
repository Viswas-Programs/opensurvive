import { OBSTACLE_SUPPLIERS } from ".";
import { getMode } from "../../homepage";
import { RectHitbox } from "../../types/math";
import { MinObstacle } from "../../types/minimized";
import { Obstacle } from "../../types/obstacle";
import { ObstacleSupplier } from "../../types/supplier";
import { Player } from "../entities";

class BoxSupplier implements ObstacleSupplier {
	create(minObstacle: MinObstacle) {
		return new Box(minObstacle);
	}
}

export default class Box extends Obstacle {
	static readonly TYPE = "box";
	type = Box.TYPE;
	static BoxImg = new Image();
	static BoxResidueImg = new Image();

	static {
		OBSTACLE_SUPPLIERS.set(Box.TYPE, new BoxSupplier());
	}

	static updateAssets() {
		this.BoxImg.src = "assets/" + getMode() + "/images/game/objects/box.svg";
		this.BoxResidueImg.src = "assets/" + getMode() + "/images/game/objects/residues/box.svg";
	}

	copy(minObstacle: MinObstacle) {
		super.copy(minObstacle);
	}

	render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		var img: HTMLImageElement;
		img = Box.BoxImg;
		if (!img.complete || !Box.BoxResidueImg.complete) return;
		const relative = this.position.addVec(you.position.inverse());
		const width = scale * (<RectHitbox>this.hitbox).width * (this.despawn ? 0.5 : 1), height = width * Box.BoxImg.naturalWidth / Box.BoxImg.naturalHeight;
		ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
		ctx.rotate(-this.direction.angle());
		ctx.drawImage(this.despawn ? Box.BoxResidueImg : img, -width / 2, -height / 2, width, height);
		ctx.resetTransform();
	}

	renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		console.log("")
	}
}