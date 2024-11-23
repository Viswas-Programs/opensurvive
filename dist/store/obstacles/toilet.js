"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obstacle_1 = require("../../types/obstacle");
const utils_1 = require("../../utils");
const _1 = require(".");
const homepage_1 = require("../../homepage");
class ToiletSupplier {
    create(minObstacle) {
        return new Toilet(minObstacle);
    }
}
// Toilet
class Toilet extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Toilet.TYPE;
        this.zIndex = 9;
    }
    static updateAssets() {
        this.toiletImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/toilet.svg";
        this.toiletResidueImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/residues/toilet.svg";
    }
    render(you, canvas, ctx, scale) {
        if (!Toilet.toiletImg.complete || !Toilet.toiletResidueImg.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        const img = this.despawn ? Toilet.toiletResidueImg : Toilet.toiletImg;
        // Times 2 because radius * 2 = diameter
        const width = scale * this.hitbox.comparable * 2, height = width * img.naturalWidth / img.naturalHeight;
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        ctx.fillStyle = "#005f00";
        (0, utils_1.circleFromCenter)(ctx, this.position.x * scale, this.position.y * scale, 2 * scale);
    }
}
Toilet.TYPE = "toilet";
Toilet.toiletImg = new Image();
Toilet.toiletResidueImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Toilet.TYPE, new ToiletSupplier());
})();
exports.default = Toilet;
