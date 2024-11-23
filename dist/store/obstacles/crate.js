"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const homepage_1 = require("../../homepage");
const obstacle_1 = require("../../types/obstacle");
class CrateSupplier {
    create(minObstacle) {
        return new Crate(minObstacle);
    }
}
class Crate extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Crate.TYPE;
    }
    static updateAssets() {
        this.crateImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/crate.svg";
        this.crateResidueImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/residues/crate.svg";
        this.grenadeCrateImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/grenade_crate.svg";
        this.sovietCrateImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/soviet_crate.svg";
    }
    copy(minObstacle) {
        super.copy(minObstacle);
        this.special = minObstacle.special;
    }
    render(you, canvas, ctx, scale) {
        var img;
        switch (this.special) {
            case "grenade":
                img = Crate.grenadeCrateImg;
                break;
            case "soviet":
                img = Crate.sovietCrateImg;
                break;
            default:
                img = Crate.crateImg;
                break;
        }
        if (!img.complete || !Crate.crateResidueImg.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        const width = scale * this.hitbox.width * (this.despawn ? 0.5 : 1), height = width * Crate.crateImg.naturalWidth / Crate.crateImg.naturalHeight;
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.drawImage(this.despawn ? Crate.crateResidueImg : img, -width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        ctx.translate(this.position.x * scale, this.position.y * scale);
        switch (this.special) {
            case "grenade":
                ctx.fillStyle = "#46502d";
                ctx.fillRect(-1.5 * scale, -1.5 * scale, 3 * scale, 3 * scale);
                break;
            default:
                ctx.fillStyle = "#683c05";
                ctx.fillRect(-2 * scale, -2 * scale, 4 * scale, 4 * scale);
                break;
        }
        ctx.resetTransform();
    }
}
Crate.TYPE = "crate";
Crate.crateImg = new Image();
Crate.crateResidueImg = new Image();
Crate.grenadeCrateImg = new Image();
Crate.sovietCrateImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Crate.TYPE, new CrateSupplier());
})();
exports.default = Crate;
