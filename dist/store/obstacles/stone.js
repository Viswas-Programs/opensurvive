"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const homepage_1 = require("../../homepage");
const obstacle_1 = require("../../types/obstacle");
const utils_1 = require("../../utils");
class StoneSupplier {
    create(minObstacle) {
        return new Stone(minObstacle);
    }
}
class Stone extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Stone.TYPE;
    }
    static updateAssets() {
        this.stoneImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/stone.svg";
        this.ak47stoneImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/ak47_stone.svg";
    }
    copy(minObstacle) {
        super.copy(minObstacle);
        this.special = minObstacle.special;
    }
    render(you, canvas, ctx, scale) {
        var img;
        switch (this.special) {
            case "ak47":
                img = Stone.ak47stoneImg;
                break;
            default:
                img = Stone.stoneImg;
                break;
        }
        if (!img.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        if (!this.despawn) {
            const width = scale * this.hitbox.comparable * 2, height = width * Stone.stoneImg.naturalWidth / Stone.stoneImg.naturalHeight;
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
        }
        else {
            const radius = scale * this.hitbox.comparable / 2;
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.25;
            (0, utils_1.circleFromCenter)(ctx, 0, 0, radius);
            ctx.globalAlpha = 1;
        }
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        ctx.fillStyle = "#b3b3b3";
        (0, utils_1.circleFromCenter)(ctx, this.position.x * scale, this.position.y * scale, 2 * scale);
    }
}
Stone.TYPE = "stone";
Stone.stoneImg = new Image();
Stone.ak47stoneImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Stone.TYPE, new StoneSupplier());
})();
exports.default = Stone;
