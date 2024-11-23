"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obstacle_1 = require("../../types/obstacle");
const utils_1 = require("../../utils");
const _1 = require(".");
const homepage_1 = require("../../homepage");
class TreeSupplier {
    create(minObstacle) {
        return new Tree(minObstacle);
    }
}
class Tree extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Tree.TYPE;
        this.zIndex = 1000;
    }
    static updateAssets() {
        this.treeImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/tree.svg";
        this.mosinTreeImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/mosin_tree.svg";
        this.treeResidueImg.src = "assets/" + (0, homepage_1.getMode)() + "/images/game/objects/residues/tree.svg";
    }
    copy(minObstacle) {
        super.copy(minObstacle);
        this.special = minObstacle.special;
    }
    render(you, canvas, ctx, scale) {
        var img;
        var renderScale = 1;
        if (this.despawn)
            img = Tree.treeResidueImg;
        else
            switch (this.special) {
                case "mosin":
                    img = Tree.mosinTreeImg;
                    renderScale = 3.6;
                    break;
                default:
                    img = Tree.treeImg;
                    renderScale = 5;
            }
        if (!img.complete || !Tree.treeResidueImg.complete)
            return;
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        const width = scale * this.hitbox.comparable * 2 * renderScale, height = width * img.naturalWidth / img.naturalHeight;
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    renderMap(_canvas, ctx, scale) {
        ctx.fillStyle = "#3e502e";
        (0, utils_1.circleFromCenter)(ctx, this.position.x * scale, this.position.y * scale, 1.5 * scale * 3.6);
    }
}
Tree.TYPE = "tree";
Tree.treeImg = new Image();
Tree.mosinTreeImg = new Image();
Tree.treeResidueImg = new Image();
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Tree.TYPE, new TreeSupplier());
})();
exports.default = Tree;
