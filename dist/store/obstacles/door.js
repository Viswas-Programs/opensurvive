"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const obstacle_1 = require("../../types/obstacle");
class DoorSupplier {
    create(minObstacle) {
        return new Door(minObstacle);
    }
}
class Door extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Door.TYPE;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.scale(scale, scale);
        const width = this.hitbox.width;
        const height = this.hitbox.height;
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    renderLayerN1(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.scale(scale, scale);
        const width = this.hitbox.width + 0.25;
        const height = this.hitbox.height + 0.25;
        ctx.fillStyle = "#333";
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.resetTransform();
    }
    // Don't draw anything on map as buildings will handle it
    renderMap(_canvas, _ctx, _scale) { }
}
Door.TYPE = "door";
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Door.TYPE, new DoorSupplier());
})();
exports.default = Door;
