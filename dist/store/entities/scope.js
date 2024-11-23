"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const entity_1 = require("../../types/entity");
const utils_1 = require("../../utils");
class ScopeSupplier {
    create(minEntity) {
        return new Scope(minEntity);
    }
}
class Scope extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Scope.TYPE;
        this.zIndex = 8;
        this.copy(minEntity);
    }
    copy(minEntity) {
        super.copy(minEntity);
        this.zoom = minEntity.zoom;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        const radius = scale * this.hitbox.comparable;
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.strokeStyle = "#000";
        ctx.lineWidth = scale * 0.1;
        (0, utils_1.circleFromCenter)(ctx, 0, 0, radius, false, true);
        ctx.fillStyle = "#00000066"; // <- alpha/opacity
        (0, utils_1.circleFromCenter)(ctx, 0, 0, radius, true, false);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.font = `${canvas.height / 54}px Arial`;
        ctx.fillText(`${this.zoom}x`, 0, 0);
        ctx.resetTransform();
    }
}
Scope.TYPE = "scope";
(() => {
    _1.ENTITY_SUPPLIERS.set(Scope.TYPE, new ScopeSupplier());
})();
exports.default = Scope;
