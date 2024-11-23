"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const homepage_1 = require("../../homepage");
const textures_1 = require("../../textures");
const math_1 = require("../../types/math");
const terrain_1 = require("../../types/terrain");
class FloorSupplier {
    create(minTerrain) {
        return new Floor(minTerrain);
    }
}
class Floor extends terrain_1.LineTerrain {
    constructor(minTerrain) {
        super(minTerrain);
        this.id = Floor.ID;
        this.color = 0x80B251;
        this.aboveTerrainLine = true;
        this.texture = minTerrain.texture;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.line.a.addVec(you.position.inverse());
        const vec = this.line.toVec();
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
        ctx.scale(scale, scale);
        ctx.translate(relative.x + vec.x * 0.5, relative.y + vec.y * 0.5);
        ctx.rotate(-vec.angle());
        const path = "assets/" + (0, homepage_1.getMode)() + "/images/game/textures/" + this.texture.path;
        const img = (0, textures_1.getTexture)(path);
        const dim = new math_1.Vec2(vec.magnitude(), this.range * 2);
        if (!(img === null || img === void 0 ? void 0 : img.complete))
            this.defaultRender(ctx, dim);
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
        ctx.resetTransform();
    }
    defaultRender(ctx, dim) {
        ctx.fillStyle = this.colorToHex(this.color);
        ctx.fillRect(-dim.x * 0.5, -dim.y * 0.5, dim.x, dim.y);
    }
    renderMap(_canvas, _ctx, _scale) {
        // We don't render anything on map, as buildings have handled it
    }
}
Floor.ID = "floor";
(() => {
    _1.TERRAIN_SUPPLIERS.set(Floor.ID, new FloorSupplier());
})();
exports.default = Floor;
