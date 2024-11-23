"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obstacle_1 = require("../../types/obstacle");
const utils_1 = require("../../utils");
const _1 = require(".");
const homepage_1 = require("../../homepage");
class BushSupplier {
    create(minObstacle) {
        return new Bush(minObstacle);
    }
}
// Bush
class Bush extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Bush.TYPE;
        this.zIndex = 10;
    }
    static updateAssets() {
        this.bushImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/bush.svg";
        this.bushResidueImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/residues/bush.svg";
    }
    render(you, canvas, ctx, scale) {
        if (!Bush.bushImg.complete || !Bush.bushResidueImg.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        const img = this.despawn ? Bush.bushResidueImg : Bush.bushImg;
        // Times 2 because radius * 2 = diameter
        const width = scale * this.hitbox.comparable * 2 * (this.despawn ? 0.5 : 1), height = width * img.naturalWidth / img.naturalHeight;
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        ctx.fillStyle = "#005f00";
        (0, utils_1.circleFromCenter)(ctx, this.position.x * scale, this.position.y * scale, 2 * scale);
    }
}
Bush.TYPE = "bush";
Bush.bushResidueImg = new Image();
Bush.bushImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Bush.TYPE, new BushSupplier());
})();
exports.default = Bush;
