"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const homepage_1 = require("../../homepage");
const obstacle_1 = require("../../types/obstacle");
class DeskSupplier {
    create(minObstacle) {
        return new Desk(minObstacle);
    }
}
class Desk extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Desk.TYPE;
    }
    static updateAssets() {
        this.deskImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/desk.svg";
        this.deskResidueImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/residues/desk.svg";
    }
    copy(minObstacle) {
        super.copy(minObstacle);
    }
    render(you, canvas, ctx, scale) {
        var img;
        img = Desk.deskImg;
        if (!img.complete || !Desk.deskResidueImg.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        const width = scale * this.hitbox.width * (this.despawn ? 0.5 : 1), height = width * Desk.deskImg.naturalWidth / Desk.deskImg.naturalHeight;
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.drawImage(this.despawn ? Desk.deskResidueImg : img, -width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        console.log("");
    }
}
Desk.TYPE = "desk";
Desk.deskImg = new Image();
Desk.deskResidueImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Desk.TYPE, new DeskSupplier());
})();
exports.default = Desk;
