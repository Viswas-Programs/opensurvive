"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowFadeParticle = exports.TextureFadeParticle = exports.FadeParticle = exports.DummyParticle = exports.Particle = void 0;
const textures_1 = require("../textures");
const utils_1 = require("../utils");
const math_1 = require("./math");
class Particle {
    constructor(minParticle) {
        this.type = "generic";
        this.ended = false;
        this.zIndex = 10;
        this.position = math_1.Vec2.fromMinVec2(minParticle.position);
        this.size = minParticle.size;
    }
}
exports.Particle = Particle;
class DummyParticle extends Particle {
    constructor() {
        super(...arguments);
        this.type = DummyParticle.TYPE;
    }
    renderTick() { }
    render() { }
}
exports.DummyParticle = DummyParticle;
DummyParticle.TYPE = "dummy";
class FadeParticle extends Particle {
    constructor(minParticle) {
        super(minParticle);
        this.type = "fade";
        this.duration = minParticle.duration;
        this.fadeStart = minParticle.fadeStart;
    }
    // Follows server TPS
    renderTick(time) {
        this.duration -= time;
        if (this.duration <= 0)
            this.ended = true;
    }
    render(you, canvas, ctx, scale) {
        const relative = this.position.addVec(you.position.inverse());
        ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
        ctx.scale(scale, scale);
        ctx.globalAlpha = (0, utils_1.clamp)(this.duration, 0, this.fadeStart) / this.fadeStart;
        this.actualRender(ctx);
        ctx.globalAlpha = 1;
        ctx.resetTransform();
    }
}
exports.FadeParticle = FadeParticle;
class TextureFadeParticle extends FadeParticle {
    constructor(minParticle) {
        super(minParticle);
        this.type = "texture_fade";
        this.direction = math_1.Vec2.UNIT_X.addAngle(Math.random() * math_1.CommonAngles.TWO_PI);
        this.angle = Math.random() * math_1.CommonAngles.TWO_PI;
    }
    renderTick(time) {
        super.renderTick(time);
        this.position = this.position.addVec(this.direction.scaleAll(time / 1000));
        this.angle += 0.01;
    }
    actualRender(ctx) {
        if (!this.texture)
            return;
        ctx.rotate(this.angle);
        const img = TextureFadeParticle.particleImages.get(this.texture);
        if (!img) {
            const newImg = new Image();
            newImg.src = (0, textures_1.getParticleImagePath)(this.texture);
            TextureFadeParticle.particleImages.set(this.texture, newImg);
        }
        else if (img.complete)
            ctx.drawImage(img, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    }
}
exports.TextureFadeParticle = TextureFadeParticle;
TextureFadeParticle.particleImages = new Map();
class GrowFadeParticle extends FadeParticle {
    constructor(minParticle) {
        super(minParticle);
        this.type = "grow_fade";
        this.color = minParticle.color;
        this.growSpeed = minParticle.growSpeed;
    }
    colorToHex(color) {
        if (!color)
            color = this.color;
        return "#" + color.toString(16);
    }
    renderTick(time) {
        super.renderTick(time);
        this.size += this.growSpeed * time / 1000;
    }
    actualRender(ctx) {
        ctx.fillStyle = this.colorToHex();
        (0, utils_1.circleFromCenter)(ctx, 0, 0, this.size);
    }
}
exports.GrowFadeParticle = GrowFadeParticle;
