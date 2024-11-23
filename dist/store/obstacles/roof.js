"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const homepage_1 = require("../../homepage");
const textures_1 = require("../../textures");
const math_1 = require("../../types/math");
const obstacle_1 = require("../../types/obstacle");
const utils_1 = require("../../utils");
class RoofSupplier {
    create(minObstacle) {
        return new Roof(minObstacle);
    }
}
class Roof extends obstacle_1.Obstacle {
    constructor() {
        super(...arguments);
        this.type = Roof.ID;
        this.zIndex = 999;
        this.opacity = 1;
    }
    copy(minObstacle) {
        super.copy(minObstacle);
        this.color = minObstacle.color;
        this.roofless = new Set(minObstacle.roofless);
        this.texture = minObstacle.texture;
    }
    render(you, canvas, ctx, scale) {
        var _a;
        // We should actually care about fps, but I'm too lazy
        if (this.roofless.has(you.id)) {
            if (this.opacity > 0)
                this.opacity -= 0.05;
            if (this.opacity < 0)
                this.opacity = 0;
        }
        else {
            if (this.opacity < 1)
                this.opacity += 0.05;
            if (this.opacity > 1)
                this.opacity = 1;
        }
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.scale(scale, scale);
        ctx.rotate(-this.direction.angle());
        ctx.globalAlpha = this.opacity;
        if ((_a = this.texture) === null || _a === void 0 ? void 0 : _a.path) {
            const img = (0, textures_1.getTexture)("assets/" + (0, homepage_1.getMode)() + "/images/game/textures/" + this.texture.path);
            let dim;
            if (this.hitbox.type === "circle") {
                const radius = this.hitbox.radius;
                dim = new math_1.Vec2(radius * 2, radius * 2);
            }
            else {
                const rect = this.hitbox;
                dim = new math_1.Vec2(rect.width, rect.height);
            }
            if (!(img === null || img === void 0 ? void 0 : img.complete))
                this.defaultRender(ctx);
            else if (this.texture.path.startsWith("fixed"))
                ctx.drawImage(img, -dim.x * 0.5, -dim.y * 0.5, dim.x, dim.y);
            else {
                if (!this.textureCache) {
                    this.textureCache = document.createElement("canvas");
                    this.textureCache.width = canvas.height * dim.x / dim.y;
                    this.textureCache.height = canvas.height;
                    const tCtx = this.textureCache.getContext("2d");
                    const fill = Math.round(this.texture.horizontalFill || 1);
                    const width = this.textureCache.width / fill;
                    const height = width * img.height / img.width;
                    for (let ii = 0; ii < Math.ceil(this.textureCache.height / height); ii++)
                        for (let jj = 0; jj < fill; jj++)
                            tCtx.drawImage(img, width * jj, height * ii, width, height);
                }
                ctx.drawImage(this.textureCache, -dim.x * 0.5, -dim.y * 0.5, dim.x, dim.y);
            }
        }
        else
            this.defaultRender(ctx);
        ctx.globalAlpha = 1;
        ctx.resetTransform();
    }
    defaultRender(ctx) {
        ctx.fillStyle = (0, utils_1.numToRGBA)(this.color);
        if (this.hitbox.type === "circle")
            (0, utils_1.circleFromCenter)(ctx, 0, 0, this.hitbox.comparable);
        else {
            const rect = this.hitbox;
            ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
        }
    }
    // buildings will handle it
    renderMap(_canvas, _ctx, _scale) { }
}
Roof.ID = "roof";
(() => {
    _1.OBSTACLE_SUPPLIERS.set(Roof.ID, new RoofSupplier());
})();
exports.default = Roof;
