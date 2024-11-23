"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const obstacle_1 = require("../../types/obstacle");
const utils_1 = require("../../utils");
class WallSupplier {
    create(minObstacle) {
        return new Wall(minObstacle);
    }
}
class Wall extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Wall.TYPE;
        this.zIndex = 1;
    }
    copy(minObstacle) {
        super.copy(minObstacle);
        this.color = minObstacle.color;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.scale(scale, scale);
        let width = this.hitbox.width;
        let height = this.hitbox.height;
        if (this.despawn) {
            width += 0.5;
            height += 0.5;
            ctx.globalAlpha = 0.4;
        }
        ctx.fillStyle = (0, utils_1.numToRGBA)(this.color);
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.globalAlpha = 1;
        ctx.resetTransform();
    }
    renderLayerN1(you, canvas, ctx, scale) {
        if (this.despawn)
            return;
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.scale(scale, scale);
        const width = this.hitbox.width + 0.5;
        const height = this.hitbox.height + 0.5;
        ctx.fillStyle = "#333";
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    // Don't draw anything on map as buildings will handle it
    renderMap(_canvas, _ctx, _scale) { }
}
Wall.TYPE = "wall";
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Wall.TYPE, new WallSupplier());
})();
exports.default = Wall;
