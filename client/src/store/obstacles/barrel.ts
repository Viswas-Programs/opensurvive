import { Player } from "../entities";
import { Obstacle } from "../../types/obstacle";
import { MinObstacle } from "../../types/minimized";
import { circleFromCenter } from "../../utils";
import { ObstacleSupplier } from "../../types/supplier";
import { OBSTACLE_SUPPLIERS } from ".";
import { getMode } from "../../homepage";
import { ObstacleTypes } from "../../constants";

interface AdditionalObstacle {
	special: "normal" | "dirty"
}

class BarrelSupplier implements ObstacleSupplier {
	create(minObstacle: MinObstacle & AdditionalObstacle) {
		return new Barrel(minObstacle);
	}
}

// Barrel
export default class Barrel extends Obstacle {
	static readonly TYPE = ObstacleTypes.BARREL;
	type = Barrel.TYPE;
	zIndex = 0;
	special!: string;
	static  barrelImg = new Image();
	static barrelResidueImg = new Image();
	static barrelDirtyImg = new Image();
	static barrelDirtyResidueImg = new Image();


	static {
		OBSTACLE_SUPPLIERS.set(Barrel.TYPE, new BarrelSupplier());
	}
	static updateAssets() {
		this.barrelResidueImg.src = "assets/" + getMode() + "/images/game/objects/residues/barrel.svg";
		this.barrelImg.src = "assets/" + getMode() + "/images/game/objects/barrel.svg";
		this.barrelDirtyResidueImg.src = "assets/" + getMode() + "/images/game/objects/residues/barrelDirty.svg";
		this.barrelDirtyImg.src = "assets/" + getMode() + "/images/game/objects/barrelDirty.svg";

	}
	copy(minObstacle: MinObstacle & AdditionalObstacle) {
		super.copy(minObstacle);
		this.special = minObstacle.special
	}

	render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number): void {
		if (!Barrel.barrelImg.complete || !Barrel.barrelResidueImg.complete || !Barrel.barrelDirtyImg.complete || !Barrel.barrelDirtyResidueImg.complete) return;
		const relative = this.position.addVec(you.position.inverse());
		ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
		ctx.rotate(-this.direction.angle());
		let img: HTMLImageElement;
		if (this.special == "dirty") { img = this.despawn ? Barrel.barrelDirtyResidueImg : Barrel.barrelDirtyImg; }
		else img = this.despawn ? Barrel.barrelResidueImg : Barrel.barrelImg;
		// Times 2 because radius * 2 = diameter
		const width = scale * this.hitbox.comparable * 2 * (this.despawn ? 0.5 : 1), height = width * img.naturalWidth / img.naturalHeight;
		ctx.drawImage(img, -width / 2, -height / 2, width, height);
		ctx.resetTransform();
	}

	renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		ctx.fillStyle = "#0000f5";
		circleFromCenter(ctx, this.position.x * scale, this.position.y * scale, 2 * scale);
	}
}