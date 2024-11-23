"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const homepage_1 = require("../../homepage");
const obstacle_1 = require("../../types/obstacle");
/*
const awcCrateImg: HTMLImageElement & { loaded: boolean } = Object.assign(new Image(), { loaded: false });
awcCrateImg.onload = () => awcCrateImg.loaded = true;
//awmCrateImg.src = "assets/images/game/objects/awm_crate.png";
*/
class TableSupplier {
    create(minObstacle) {
        return new Table(minObstacle);
    }
}
class Table extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Table.TYPE;
        this.zIndex = 11;
    }
    static updateAssets() {
        this.tableImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/table.svg";
        this.tableResidueImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/residues/table.svg";
    }
    copy(minObstacle) {
        super.copy(minObstacle);
    }
    render(you, canvas, ctx, scale) {
        var img;
        img = Table.tableImg;
        if (!img.complete || !Table.tableResidueImg.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        const width = scale * this.hitbox.width * (this.despawn ? 0.5 : 1), height = width * Table.tableImg.naturalWidth / Table.tableImg.naturalHeight;
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.drawImage(this.despawn ? Table.tableResidueImg : img, -width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        console.log("");
    }
}
Table.TYPE = "table";
Table.tableImg = new Image();
Table.tableResidueImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Table.TYPE, new TableSupplier());
})();
exports.default = Table;
