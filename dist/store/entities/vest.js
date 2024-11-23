"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const entity_1 = require("../../types/entity");
const utils_1 = require("../../utils");
const textures_1 = require("../../textures");
class VestSupplier {
    create(minEntity) {
        return new Vest(minEntity);
    }
}
class Vest extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Vest.TYPE;
        this.zIndex = 8;
        this.copy(minEntity);
    }
    copy(minEntity) {
        super.copy(minEntity);
        this.level = minEntity.level;
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
        const img = Vest.vestImages[this.level - 1];
        if (!(img === null || img === void 0 ? void 0 : img.complete)) {
            if (!img) {
                const image = new Image();
                image.src = (0, textures_1.getVestImagePath)(this.level);
                Vest.vestImages[this.level - 1] = image;
            }
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#fff";
            ctx.font = `${canvas.height / 54}px Arial`;
            ctx.fillText(`V${this.level}`, 0, 0);
        }
        else
            ctx.drawImage(img, -0.6 * radius, -0.6 * radius, 1.2 * radius, 1.2 * radius);
        ctx.resetTransform();
    }
}
Vest.vestImages = Array(4).fill(undefined);
Vest.TYPE = "vest";
(() => {
    _1.ENTITY_SUPPLIERS.set(Vest.TYPE, new VestSupplier());
})();
exports.default = Vest;
