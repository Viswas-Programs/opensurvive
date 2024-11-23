"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obstacle_1 = require("../../types/obstacle");
const utils_1 = require("../../utils");
const _1 = require(".");
const homepage_1 = require("../../homepage");
class ToiletMoreSupplier {
    create(minObstacle) {
        return new ToiletMore(minObstacle);
    }
}
// ToiletMore
class ToiletMore extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = ToiletMore.TYPE;
        this.zIndex = 9;
    }
    static updateAssets() {
        this.toiletMoreImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/toilet_more.svg";
        this.toiletMResidueImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/residues/toilet.svg";
    }
    render(you, canvas, ctx, scale) {
        if (!ToiletMore.toiletMoreImg.complete || !ToiletMore.toiletMResidueImg.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        const img = this.despawn ? ToiletMore.toiletMResidueImg : ToiletMore.toiletMoreImg;
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
ToiletMore.TYPE = "toilet_more";
ToiletMore.toiletMoreImg = new Image();
ToiletMore.toiletMResidueImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(ToiletMore.TYPE, new ToiletMoreSupplier());
})();
exports.default = ToiletMore;
