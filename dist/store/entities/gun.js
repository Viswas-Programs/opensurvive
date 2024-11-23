"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const textures_1 = require("../../textures");
const entity_1 = require("../../types/entity");
const utils_1 = require("../../utils");
class GunSupplier {
    create(minEntity) {
        return new Gun(minEntity);
    }
}
class Gun extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Gun.TYPE;
        this.zIndex = 8;
        this.copy(minEntity);
    }
    copy(minEntity) {
        super.copy(minEntity);
        this.nameId = minEntity.nameId;
        this.color = minEntity.color;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        const radius = scale * this.hitbox.comparable;
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.rotate(-this.direction.angle());
        ctx.strokeStyle = `#${_1.Ammo.colorScheme[this.color][2]}`;
        ctx.lineWidth = scale * 0.25;
        (0, utils_1.circleFromCenter)(ctx, 0, 0, radius, false, true);
        ctx.fillStyle = `#${_1.Ammo.colorScheme[this.color][2]}66`;
        (0, utils_1.circleFromCenter)(ctx, 0, 0, radius, true, false);
        const img = Gun.gunImages.get(this.nameId);
        if (!(img === null || img === void 0 ? void 0 : img.complete)) {
            if (!img) {
                const image = new Image();
                image.src = (0, textures_1.getWeaponImagePath)(this.nameId);
                Gun.gunImages.set(this.nameId, image);
            }
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#fff";
            ctx.font = `${canvas.height / 54}px Arial`;
            ctx.fillText(this.nameId, 0, 0);
        }
        else
            ctx.drawImage(img, -0.7 * radius, -0.7 * radius, 1.4 * radius, 1.4 * radius);
        ctx.resetTransform();
    }
}
Gun.gunImages = new Map();
Gun.TYPE = "gun";
(() => {
    _1.ENTITY_SUPPLIERS.set(Gun.TYPE, new GunSupplier());
})();
exports.default = Gun;
