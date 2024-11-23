"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const textures_1 = require("../../textures");
const entity_1 = require("../../types/entity");
const utils_1 = require("../../utils");
class HealingSupplier {
    create(minEntity) {
        return new Healing(minEntity);
    }
}
class Healing extends entity_1.Entity {
    constructor(minEntity) {
        super(minEntity);
        this.type = Healing.TYPE;
        this.zIndex = 8;
        this.copy(minEntity);
    }
    static setupHud() {
        return __awaiter(this, void 0, void 0, function* () {
            const div = document.getElementById("healing-container");
            div.innerHTML = "";
            const list = yield fetch(`data/healings/.list.json`).then(res => res.json());
            this.mapping = list;
            for (let ii = 0; ii < list.length; ii++) {
                const file = list[ii];
                div.innerHTML += `<tr class="healing-panel" id="healing-panel-${ii}"><td class="healing-image-container"><img class="healing-image" id="healing-image-${ii}" src="${(0, textures_1.getHealingImagePath)(file)}" /></td><td class="healing-count-container"><span class="healing-count" id="healing-count-${ii}">0</span></td></tr>`;
            }
        });
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
        const img = Healing.healingImages.get(this.nameId);
        if (!(img === null || img === void 0 ? void 0 : img.complete)) {
            if (!img) {
                const image = new Image();
                image.src = (0, textures_1.getHealingImagePath)(this.nameId);
                Healing.healingImages.set(this.nameId, image);
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
Healing.healingImages = new Map();
Healing.TYPE = "healing";
(() => {
    _1.ENTITY_SUPPLIERS.set(Healing.TYPE, new HealingSupplier());
})();
exports.default = Healing;
