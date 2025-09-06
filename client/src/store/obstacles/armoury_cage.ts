import { Player } from "../entities";
import { Obstacle } from "../../types/obstacle";
import { MinObstacle } from "../../types/minimized";
import { circleFromCenter } from "../../utils";
import { ObstacleSupplier } from "../../types/supplier";
import { OBSTACLE_SUPPLIERS } from ".";
import { getMode } from "../../homepage";
import { ObstacleTypes } from "../../constants";
import { RectHitbox } from "../../types/math";



class Armoury_CageSupplier implements ObstacleSupplier {
	create(minObstacle: MinObstacle) {
		return new Armoury_Cage(minObstacle);
	}
}

// Armoury_Cage
export default class Armoury_Cage extends Obstacle {
	static readonly TYPE = ObstacleTypes.ARMOURY_CAGE;
	type = Armoury_Cage.TYPE;
	zIndex = 0;
	static  Armoury_CageImg = new Image();
	static Armoury_CageResidueImg = new Image();


	static {
		OBSTACLE_SUPPLIERS.set(Armoury_Cage.TYPE, new Armoury_CageSupplier());
	}
	static updateAssets() {
		this.Armoury_CageResidueImg.src = "assets/" + getMode() + "/images/game/objects/residues/barrel.svg";
		this.Armoury_CageImg.src = "assets/" + getMode() + "/images/game/objects/armoury_cage.svg";

	}
	copy(minObstacle: MinObstacle) {
		super.copy(minObstacle);
	}

	render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
			var img: HTMLImageElement;
			img = Armoury_Cage.Armoury_CageImg;
			if (!img.complete || !Armoury_Cage.Armoury_CageResidueImg.complete) return;
			const relative = this.position.addVec(you.position.inverse());
			//const width = scale * (<RectHitbox>this.hitbox).width * (this.despawn ? 0.5 : 1), height = width * Armoury_Cage.Armoury_CageImg.naturalWidth / Armoury_Cage.Armoury_CageImg.naturalHeight;
			const width = scale * (<RectHitbox>this.hitbox).width * (this.despawn ? 0.5 : 1), height = scale * (<RectHitbox>this.hitbox).height * (this.despawn ? 0.5 : 1);
			ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
			ctx.rotate(-this.direction.angle());
			ctx.drawImage(this.despawn ? Armoury_Cage.Armoury_CageResidueImg : img, -width / 2, -height / 2, width, height);
			ctx.resetTransform();
		}

	renderMap(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		ctx.fillStyle = "#0000f5";
		circleFromCenter(ctx, this.position.x * scale, this.position.y * scale, 2 * scale);
	}
}