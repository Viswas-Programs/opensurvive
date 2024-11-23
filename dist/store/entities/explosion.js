"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const entity_1 = require("../../types/entity");
const utils_1 = require("../../utils");
class ExplosionSupplier {
    create(minEntity) {
        return new Explosion(minEntity);
    }
}
class Explosion extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Explosion.TYPE;
        this.copy(minEntity);
    }
    copy(minEntity) {
        super.copy(minEntity);
        this.health = minEntity.health;
        this.maxHealth = minEntity.maxHealth;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(this.direction.angle());
        ctx.scale(scale, scale);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.hitbox.comparable);
        gradient.addColorStop(0, "#000000ff");
        gradient.addColorStop(1, "#00000000");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = this.health / this.maxHealth;
        (0, utils_1.circleFromCenter)(ctx, 0, 0, this.hitbox.comparable, true);
        ctx.globalAlpha = 1;
        ctx.resetTransform();
    }
}
Explosion.TYPE = "explosion";
(() => {
    _1.ENTITY_SUPPLIERS.set(Explosion.TYPE, new ExplosionSupplier());
})();
exports.default = Explosion;
