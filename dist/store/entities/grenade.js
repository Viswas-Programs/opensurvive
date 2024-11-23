"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const textures_1 = require("../../textures");
const entity_1 = require("../../types/entity");
const utils_1 = require("../../utils");
class GrenadeSupplier {
    create(minEntity) {
        return new Grenade(minEntity);
    }
}
class Grenade extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Grenade.TYPE;
        this.zIndex = 8;
        this.copy(minEntity);
    }
    copy(minEntity) {
        super.copy(minEntity);
        this.nameId = minEntity.nameId;
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
        const img = Grenade.grenadeImages.get(this.nameId);
        if (!(img === null || img === void 0 ? void 0 : img.complete)) {
            if (!img) {
                const image = new Image();
                image.src = (0, textures_1.getWeaponImagePath)(this.nameId);
                Grenade.grenadeImages.set(this.nameId, image);
            }
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#fff";
            ctx.font = `${canvas.height / 54}px Arial`;
            ctx.fillText(this.nameId, 0, 0);
        }
        else
            ctx.drawImage(img, -0.6 * radius, -0.6 * radius, 1.2 * radius, 1.2 * radius);
        ctx.resetTransform();
    }
}
Grenade.grenadeImages = new Map();
Grenade.TYPE = "grenade";
(() => {
    _1.ENTITY_SUPPLIERS.set(Grenade.TYPE, new GrenadeSupplier());
})();
exports.default = Grenade;
