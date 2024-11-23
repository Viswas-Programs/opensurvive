"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const entity_1 = require("../../types/entity");
const utils_1 = require("../../utils");
class AmmoSupplier {
    create(minEntity) {
        return new Ammo(minEntity);
    }
}
class Ammo extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Ammo.TYPE;
        this.zIndex = 8;
        this.copy(minEntity);
    }
    copy(minEntity) {
        super.copy(minEntity);
        this.amount = minEntity.amount;
        this.color = minEntity.color;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.scale(scale, scale);
        ctx.strokeStyle = `#${Ammo.colorScheme[this.color][0]}`;
        ctx.lineWidth = 0.2;
        ctx.fillStyle = `#${Ammo.colorScheme[this.color][1]}`;
        (0, utils_1.circleFromCenter)(ctx, 0, 0, this.hitbox.comparable * 2 / 3, true, true);
        ctx.fillStyle = `#${Ammo.colorScheme[this.color][2]}`;
        (0, utils_1.circleFromCenter)(ctx, -this.hitbox.comparable / 8 + this.hitbox.comparable / 6, -this.hitbox.comparable / 4 + this.hitbox.comparable / 6, this.hitbox.comparable / 3);
        ctx.resetTransform();
    }
}
_a = Ammo;
Ammo.TYPE = "ammo";
Ammo.colorScheme = [];
(() => {
    _1.ENTITY_SUPPLIERS.set(Ammo.TYPE, new AmmoSupplier());
    fetch("data/colors/ammos.json").then(res => res.json()).then(x => _a.colorScheme = x);
})();
exports.default = Ammo;
